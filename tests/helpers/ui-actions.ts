import { type FrameLocator, type Locator, type Page } from '@playwright/test';
import { MilliSeconds } from '../enums/milliseconds.enum';

export class UIActions {
  constructor(protected page: Page) {}

  async click(locator: Locator, timeoutValue: MilliSeconds = MilliSeconds.SHORT): Promise<void> {
    await locator.click({ timeout: timeoutValue });
  }

  async dragDrop(
    source: Locator,
    target: Locator,
    timeoutValue: MilliSeconds = MilliSeconds.LARGE,
  ): Promise<void> {
    await source.dragTo(target, { timeout: timeoutValue });
  }

  async rightClick(
    locator: Locator,
    timeoutValue: MilliSeconds = MilliSeconds.SHORT,
  ): Promise<void> {
    await locator.click({ button: 'right', timeout: timeoutValue });
  }

  async doubleClick(
    locator: Locator,
    timeoutValue: MilliSeconds = MilliSeconds.SHORT,
  ): Promise<void> {
    await locator.dblclick({ timeout: timeoutValue });
  }

  async clearInput(locator: Locator): Promise<void> {
    await locator.fill('');
  }

  async deleteAllCookies(): Promise<void> {
    await this.page.context().clearCookies();
  }

  async getUrl(): Promise<string> {
    return this.page.url();
  }

  async getText(locator: Locator): Promise<string> {
    return locator.innerText();
  }

  async getAttributeValue(locator: Locator, attributeName: string): Promise<string | null> {
    return locator.getAttribute(attributeName);
  }

  async getSelectedOption(locator: Locator): Promise<string> {
    return locator.locator('option:checked').innerText();
  }

  async getCheckBoxStatus(locator: Locator): Promise<boolean> {
    return locator.isChecked();
  }

  async getWindowTitle(): Promise<string> {
    return this.page.title();
  }

  getByRole(
    role: Parameters<Page['getByRole']>[0],
    options?: Parameters<Page['getByRole']>[1],
  ): Locator {
    return this.page.getByRole(role, options);
  }

  getByValue(value: string | RegExp): Locator {
    return this.page.getByText(value);
  }

  getByName(name: string | RegExp, options?: Parameters<Page['getByLabel']>[1]): Locator {
    return this.page.getByLabel(name, options);
  }

  getByText(text: string | RegExp, options?: Parameters<Page['getByText']>[1]): Locator {
    return this.page.getByText(text, options);
  }

  getByPlaceholder(
    text: string | RegExp,
    options?: Parameters<Page['getByPlaceholder']>[1],
  ): Locator {
    return this.page.getByPlaceholder(text, options);
  }

  getByTestId(testId: string | RegExp): Locator {
    return this.page.getByTestId(testId);
  }

  async isClickable(locator: Locator): Promise<boolean> {
    return (await locator.isVisible()) && (await locator.isEnabled());
  }

  async isSelected(locator: Locator): Promise<boolean> {
    return locator.isChecked();
  }

  async pressKey(locator: Locator, key: string): Promise<void> {
    await locator.press(key);
  }

  async maximizeWindowSize(): Promise<void> {
    await this.page.setViewportSize({ width: 1920, height: 1080 });
  }

  async navigateTo(url: string, timeoutValue: MilliSeconds = MilliSeconds.LARGE): Promise<void> {
    await this.page.goto(url, { timeout: timeoutValue });
  }

  async openNewWindow(url?: string): Promise<Page> {
    const newPage = await this.page.context().newPage();
    if (url) {
      await newPage.goto(url);
    }
    return newPage;
  }

  async refreshBrowser(): Promise<void> {
    await this.page.reload();
  }

  async scrollToElement(locator: Locator): Promise<void> {
    await locator.scrollIntoViewIfNeeded();
  }

  async selectByIndex(locator: Locator, index: number): Promise<void> {
    if (!Number.isInteger(index) || index < 0) {
      throw new RangeError(`Select option index must be a non-negative integer; received ${index}.`);
    }
    await locator.selectOption({ index });
  }

  async selectByVisibleText(locator: Locator, label: string): Promise<void> {
    await locator.selectOption({ label });
  }

  async slowTypeFlex(
    locator: Locator,
    text: string,
    delayMilliseconds = 100,
  ): Promise<void> {
    await locator.fill('');
    await locator.pressSequentially(text, { delay: delayMilliseconds });
  }

  switchToFrame(selector: string): FrameLocator {
    return this.page.frameLocator(selector);
  }

  async waitForBrowserUrlContains(
    text: string,
    timeoutValue: MilliSeconds = MilliSeconds.LARGE,
  ): Promise<void> {
    await this.page.waitForURL((url) => url.toString().includes(text), {
      timeout: timeoutValue,
    });
  }

  async waitForEnable(
    locator: Locator,
    timeoutValue: MilliSeconds = MilliSeconds.LARGE,
  ): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout: timeoutValue });
    await this.page.waitForFunction(
      (element) => {
        if (!(element instanceof HTMLElement)) return false;
        return !element.matches(':disabled') && element.getAttribute('aria-disabled') !== 'true';
      },
      await locator.elementHandle(),
      { timeout: timeoutValue },
    );
  }

  async waitForPresence(
    locator: Locator,
    timeoutValue: MilliSeconds = MilliSeconds.LARGE,
  ): Promise<void> {
    await locator.waitFor({ state: 'attached', timeout: timeoutValue });
  }

  async waitForVisible(
    locator: Locator,
    timeoutValue: MilliSeconds = MilliSeconds.LARGE,
  ): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout: timeoutValue });
  }

  async waitForHidden(
    locator: Locator,
    timeoutValue: MilliSeconds = MilliSeconds.LARGE,
  ): Promise<void> {
    await locator.waitFor({ state: 'hidden', timeout: timeoutValue });
  }
}
