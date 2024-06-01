import { MetaMaskInpageProvider } from "@metamask/providers";
import PortStream from "extension-port-stream";
import { detect } from "detect-browser";

const browser = detect();

const EXTENSION_IDS = {
  CHROME: "nkbihfbeogaeaoehlefnkodbefgpgknn",
  FIREFOX: "webextension@metamask.io",
};

function getMetaMaskId() {
  switch (browser && browser.name) {
    case "chrome":
      return EXTENSION_IDS.CHROME;
    case "firefox":
      return EXTENSION_IDS.FIREFOX;
    default:
      return EXTENSION_IDS.CHROME;
  }
}

function getShouldSendMetadata() {
    return true
}

function getDefaultConfig(): IProviderParams {
  return {
    metamaskExtensionId: getMetaMaskId(),
    shouldSendMetadata: getShouldSendMetadata()
  };
}

/**
 * A type of settings necessary to establish connection
 */
export interface IProviderParams {
  /**
   * An extension id of metamask
   *
   * Default for Chrome: "nkbihfbeogaeaoehlefnkodbefgpgknn"
   * Default for Firefox: "webextension@metamask.io"
   */
  metamaskExtensionId?: string;
  shouldSendMetadata?: boolean;
}

/**
 * @example
 * ```ts
 * const provider = createMetaMaskProvider()
 *
 * provider.request({
 *   // ...
 * })
 * ```
 */
const createMetaMaskProvider: (
    a?: IProviderParams | undefined
  ) => MetaMaskInpageProvider = (x) => {
    x ??= getDefaultConfig();
    x.metamaskExtensionId ??= getMetaMaskId();
    x.shouldSendMetadata ??= getShouldSendMetadata();
  
    // see https://github.com/MetaMask/providers/blob/v16.1.0/src/MetaMaskInpageProvider.ts#L27
    const options = {
      shouldSendMetadata: x.shouldSendMetadata
    };

    const port = chrome.runtime.connect(x.metamaskExtensionId);
    const portStream = new PortStream(port);
    return new MetaMaskInpageProvider(portStream, options);
  };

export default createMetaMaskProvider;