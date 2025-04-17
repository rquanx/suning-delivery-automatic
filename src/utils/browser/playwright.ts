import fs from 'fs'
import { nanoid } from 'nanoid'
import os from 'os'
import path from 'pathe'
import { chromium, type Browser, type BrowserContext, type Page } from 'playwright'
import { sleep } from '../timer'
import { chromeUserDir } from './chrome'
import { logger } from '../logger'

export const clearContext = async (context: BrowserContext, clearLocalStorage = true) => {
  const pages = context.pages()
  for (const page of pages) {
    try {
      if (clearLocalStorage) {
        try {
          await page.evaluate(() => `localStorage.clear()`)
        } catch {
          logger.error('clear local storage failed')
        }
      }
      await closePage(page)
    } catch (ex2) {
    }
  }
  await context.clearCookies()
}

export class BrowserInstance {
  private browser: Browser | null = null
  private context: BrowserContext | null = null
  private tempDir: string | null = null

  private copyShareFile(sourceProfileParentDir: string, fileName: string) {
    const sourceFile = path.join(sourceProfileParentDir, fileName)
    const targetFile = path.join(this.tempDir!, fileName)
    if (fs.existsSync(sourceFile)) {
      fs.copyFileSync(sourceFile, targetFile)
    }
  }

  private linkShareFolder(sourceFolder: string, targetFolder: string) {
    if (fs.existsSync(sourceFolder)) {
      if (process.platform === 'win32') {
        fs.symlinkSync(sourceFolder, targetFolder, 'junction')
      } else {
        fs.symlinkSync(sourceFolder, targetFolder)
      }
      return
    }
  }

  private linkProfile(profileName: string) {
    // 创建临时目录
    const tempId = nanoid()
    this.tempDir = path.join(os.tmpdir(), 'suning-delivery-automatic', `chrome-profile-${tempId}`)
    fs.mkdirSync(this.tempDir, { recursive: true })

    const sourceProfileParentDir = chromeUserDir()
    const targetProfileDir = path.join(this.tempDir, profileName)
    this.copyShareFile(sourceProfileParentDir, 'Local State')
    this.linkShareFolder(sourceProfileParentDir, targetProfileDir)
    
    
    // const sourceProfileDir = path.join(sourceProfileParentDir, profileName)
    // const list = fs.readdirSync(sourceProfileParentDir)
    // list.forEach(item => {
    //   const fullPath = path.join(sourceProfileParentDir, item)
    //   const stat = fs.statSync(fullPath)
    //   if (stat.isDirectory()) {
    //     this.linkShareFolder(sourceProfileDir, path.join(this.tempDir!, item))
    //   }
    //   if (stat.isFile()) {
    //     this.copyShareFile(sourceProfileParentDir, item)
    //   }
    // })

    // this.copyShareFile(sourceProfileParentDir, 'first_party_sets.db')
    // this.copyShareFile(sourceProfileParentDir, 'Module Info Cache')
    // this.copyShareFile(sourceProfileParentDir, 'en-US-10-1.bdic')
    // this.copyShareFile(sourceProfileParentDir, 'CrashpadMetrics-active.pma')
    // this.copyShareFile(sourceProfileParentDir, 'BrowserMetrics-spare.pma')
    // this.linkShareFolder(sourceProfileDir, path.join(this.tempDir, profileName));
    // const folders = ["AmountExtractionHeuristicRegexes",
    //   "PrivacySandboxAttestationsPreloaded",
    //   "AutofillStates",
    //   "ProbabilisticRevealTokenRegistry",
    //   "BrowserMetrics",
    //   "CertificateRevocation",
    //   "ClientSidePhishing",
    //   "CookieReadinessList",
    //   "Crashpad",
    //   "Crowd Deny",
    //   "RecoveryImproved",
    //   "SSLErrorAssistant",
    //   "DeferredBrowserMetrics",
    //   "Safe Browsing",
    //   "FileTypePolicies",
    //   "SafetyTips",
    //   "ShaderCache",
    //   "FirstPartySetsPreloaded",
    //   "Subresource Filter",
    //   "GrShaderCache",
    //   "System Profile",
    //   "GraphiteDawnCache",
    //   "ThirdPartyModuleList64",
    //   "TpcdMetadata",
    //   "TrustTokenKeyCommitments",
    //   "Webstore Downloads",
    //   "Local Traces",
    //   "WidevineCdm",
    //   "MEIPreload",
    //   "ZxcvbnData",
    //   "MediaFoundationWidevineCdm",
    //   "component_crx_cache",
    //   "Notification Resources",
    //   "extensions_crx_cache",
    //   "NotificationHelperMetrics",
    //   "OnDeviceHeadSuggestModel",
    //   "hyphen-data",
    //   "OpenCookieDatabase",
    //   "optimization_guide_model_store",
    //   "OptimizationHints",
    //   "screen_ai",
    //   "OriginTrials",
    //   "segmentation_platform",
    //   "PKIMetadata",
    //   "PnaclTranslationCache"]
    // folders.forEach(item => {
    //   this.linkShareFolder(sourceProfileDir, path.join(this.tempDir!, item))
    // })
  }

  async createContext(options: { profileName?: string; headless?: boolean; proxy?: string }) {
    const { profileName, headless, proxy } = options
    if (profileName) {
      this.linkProfile(profileName)
      const context = await chromium.launchPersistentContext(this.tempDir!, {
        channel: 'chrome',
        headless,
        proxy: proxy ? { server: proxy } : undefined,
        args: [`--profile-directory=${profileName}`, "--window-size=1920,1040"],
        ignoreDefaultArgs: ['--enable-automation', '--disable-extensions']
      })
      this.context = context
      return context
    } else {
      const browser = await chromium.launch({
        headless,
        proxy: proxy ? { server: proxy } : undefined
      })
      const context = await browser.newContext()
      this.browser = browser
      this.context = context
      return context
    }
  }
  async close() {
    try {
      if (this.context) {
        try {
          await this.context.close()
        } catch (e) {
          logger.error('关闭浏览器上下文失败', e)
        }
      }
      if (this.browser) {
        try {
          await this.browser.close()
        } catch (e) {
          logger.error('关闭浏览器失败', e)
        }
      }
      await sleep(5000)
      // 清理临时目录
      if (this.tempDir && fs.existsSync(this.tempDir)) {
        try {
          // 删除软链接和临时目录
          fs.rmSync(this.tempDir, { recursive: true, force: true })
        } catch (error) {
        }
      }
    } catch (e) {
      logger.error('关闭浏览器失败', e)
    }
  }
}

export const closePage = async (page: Page) => {
  try {
    await page.close()
  } catch (e) {
    logger.error('关闭页面失败', e)
  }
}
