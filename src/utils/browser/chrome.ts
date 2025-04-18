import path from 'pathe'
import fs from 'fs'
import os from 'os'
import { logger } from '../logger'


export interface ChromeProfile {
  realName: string
  displayName: string
}

export interface LocalState {
  profile?: {
    info_cache?: Record<
      string,
      {
        shortcut_name?: string
      }
    >
  }
}

export const chromeUserDir = () => path.join(os.tmpdir(), '../Google', 'Chrome', 'User Data')

export function getProfileNames(): ChromeProfile[] {
  const list: ChromeProfile[] = []
  try {
    const statePath = path.join(chromeUserDir(), 'Local State')
    if (fs.existsSync(statePath)) {
      const jsonContent = fs.readFileSync(statePath, 'utf-8')
      const doc = JSON.parse(jsonContent) as LocalState
      const accountDic = doc?.profile?.info_cache
      if (accountDic) {
        Object.entries(accountDic).forEach(([profileKey, profileData]) => {
          list.push({
            realName: profileKey,
            displayName: profileData?.['shortcut_name'] ?? profileKey
          })
        })
      }
    }
  } catch (error) {
    logger.error('获取 chrome 用户目录失败', error)
  }
  return list
}
