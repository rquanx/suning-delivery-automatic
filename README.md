# Suning Auto Fulfillment Tool

An automation tool that simplifies the order fulfillment process between JuShuiTan (ERP) and Suning Cloud Platform.

## Background

In daily operations, merchants need to manually process orders by:
1. Retrieving logistics information from JuShuiTan ERP system
2. Logging into Suning Cloud Platform
3. Manually entering shipping information
4. Confirming order fulfillment

This manual process is:
- Time-consuming
- Error-prone
- Requires constant switching between systems
- Labor-intensive

This tool automates the entire process, significantly reducing manual operations.

## Key Features

- **Automated Fulfillment**: One-click automation from retrieving logistics info to order fulfillment
- **Batch Processing**: Automatically handles multiple orders in one run
- **Smart Matching**: Automatic logistics company mapping
- **Result Reporting**: Generates detailed fulfillment reports
- **Error Reduction**: Minimizes human error by reducing manual operations

## How It Works

1. **Prerequisites**
   - Chrome browser installed
   - Chrome user profile created
   - node runtime
   - Valid login credentials for both platforms:
     - JuShuiTan ERP
     - Suning Cloud Platform

2. **Start the Tool**
  double click `run.bat`

3. **Automated Process**
   - Select Chrome user profile
   - Confirm Chrome instance closure
   - The tool automatically:
     1. Collects pending orders from Suning
     2. Retrieves logistics information from JuShuiTan
     3. Executes order fulfillment on Suning
     4. Generates a processing report

## Efficiency Improvements

- **Time Saving**: Reduces processing time from 3-5 minutes per order to seconds
- **Batch Operations**: Processes dozens of orders in one run without manual intervention
- **Accuracy**: Eliminates manual input errors
- **Productivity**: Frees up staff for other important tasks

## Execution Report

A detailed CSV report is generated after each run, including:
- Order number
- Logistics company
- Tracking number
- Fulfillment status
- Failure reason (if any)

## Benefits

1. **Operational Efficiency**
   - Eliminates repetitive manual work
   - Reduces processing time significantly
   - Handles multiple orders simultaneously

2. **Error Prevention**
   - Eliminates manual data entry errors
   - Ensures consistent processing
   - Provides clear error reporting

3. **Cost Reduction**
   - Reduces labor costs
   - Minimizes processing errors
   - Improves operational efficiency

## Usage Tips

- Ensure both platforms are properly logged in before use
- Test with a small batch of orders during first use
- Review the report after execution
- Check error details for any failed orders
- Keep platform credentials up to date

## Technical Support

- Supports major logistics companies in China
- Multiple Chrome profile support
- Batch order processing capability
- Automatic error handling and reporting

## System Requirements

- Node.js
- Chrome browser
- Stable internet connection
- Valid accounts for:
  - JuShuiTan ERP
  - Suning Cloud Platform

## Best Practices

1. **Before Running**
   - Close unnecessary Chrome windows
   - Verify platform logins
   - Ensure stable internet connection

2. **During Operation**
   - Monitor the first few orders
   - Keep the automation window visible
   - Don't interact with the automated browser

3. **After Completion**
   - Review the generated report
   - Verify successful fulfillments
   - Handle any failed orders manually if necessary

## Support

The tool supports all major logistics companies operating in China and is regularly updated to maintain compatibility with both platforms' changes.


---

<div align="center">
  <sub>Powered by AI - Enhancing Efficiency Through Intelligent Automation</sub>
</div>