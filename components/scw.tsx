// import styles from "../styles/Home.module.css";
import { useCallback, useEffect, useState } from "react";
import { ethers } from "ethers";
import { ChainId } from "@biconomy/core-types";
import SocialLogin from "@biconomy/web3-auth";
import SmartAccount from "@biconomy/smart-account";
import Button from "./Button";
import { signIn, signOut, useSession } from "next-auth/react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const Home = () => {
  const [provider, setProvider] = useState<any>();
  const [account, setAccount] = useState<string>();
  const [smartAccount, setSmartAccount] = useState<SmartAccount | null>(null);
  const [scwAddress, setScwAddress] = useState("");
  const [scwLoading, setScwLoading] = useState(false);
  const [socialLoginSDK, setSocialLoginSDK] = useState<SocialLogin | null>(
    null
  );
  const [connectWeb3Loading, setConnectWeb3Loading] = useState(false);

  const { data: session, status } = useSession();
  console.log("session -> ", session);
  // console.log("account -> ", account);
  // console.log("smartAccount -> ", smartAccount);
  // console.log("scwAddress -> ", scwAddress);
  // console.log("scwLoading -> ", scwLoading);
  // console.log("socialLoginSDK -> ", socialLoginSDK);

  const connectWeb3 = useCallback(async () => {
    if (typeof window === "undefined") return;
    console.log("socialLoginSDK ->", socialLoginSDK);

    setConnectWeb3Loading(true);

    const sdk = new SocialLogin();

    if (!socialLoginSDK) {
      await sdk.init({
        chainId: ethers.utils.hexValue(80001),
      });
      setSocialLoginSDK(sdk);
      sdk.showWallet();
    }

    if (socialLoginSDK?.provider) {
      const web3Provider = new ethers.providers.Web3Provider(
        socialLoginSDK.provider
      );
      setProvider(web3Provider);
      const accounts = await web3Provider.listAccounts();
      setAccount(accounts[0]);

      if (status === "unauthenticated") {
        const retrievedUserInfo = await sdk.getUserInfo();
        const userInfo = {
          name: retrievedUserInfo?.name,
          email: retrievedUserInfo?.email,
          profileImage: retrievedUserInfo?.profileImage,
          walletAddress: accounts[0],
        };
        signIn("credentials", { callbackUrl: "/merchandise", ...userInfo });
      }

      return;
    }

    if (socialLoginSDK) {
      socialLoginSDK.showWallet();
      setConnectWeb3Loading(false);
      return socialLoginSDK;
    }

    setConnectWeb3Loading(false);

    return socialLoginSDK;
  }, [socialLoginSDK]);

  useEffect(() => {
    connectWeb3();
  }, []);

  // if wallet already connected close widget
  useEffect(() => {
    console.log("hidelwallet");
    if (socialLoginSDK && socialLoginSDK.provider) {
      socialLoginSDK.hideWallet();
    }
  }, [account, socialLoginSDK]);

  // after metamask login -> get provider event
  useEffect(() => {
    const interval = setInterval(async () => {
      if (account) {
        clearInterval(interval);
      }
      if (socialLoginSDK?.provider && !account) {
        connectWeb3();
      }
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [account, connectWeb3, socialLoginSDK]);

  const disconnectWeb3 = async () => {
    if (!socialLoginSDK || !socialLoginSDK.web3auth) {
      console.error("Web3Modal not initialized.");
      return;
    }
    await socialLoginSDK.logout();
    signOut({ callbackUrl: "/login" });
    socialLoginSDK.hideWallet();
    setProvider(undefined);
    setAccount(undefined);
    setScwAddress("");
  };

  useEffect(() => {
    async function setupSmartAccount() {
      setScwAddress("");
      setScwLoading(true);
      const smartAccount = new SmartAccount(provider, {
        activeNetworkId: ChainId.GOERLI,
        supportedNetworksIds: [ChainId.GOERLI],
      });
      await smartAccount.init();
      const context = smartAccount.getSmartAccountContext();
      setScwAddress(context.baseWallet.getAddress());
      setSmartAccount(smartAccount);
      setScwLoading(false);
    }
    if (!!provider && !!account) {
      setupSmartAccount();
      console.log("Provider...", provider);
    }
  }, [account, provider]);

  const ButtonLoadingAnimation = () => (
    <div className="flex gap-x-2">
      <svg className="h-4 w-4 animate-spin" viewBox="3 3 18 18">
        <path
          className="fill-blue-600"
          d="M12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19C15.866 19 19 15.866 19 12C19 8.13401 15.866 5 12 5ZM3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12Z"
        ></path>
        <path
          className="fill-blue-100"
          d="M16.9497 7.05015C14.2161 4.31648 9.78392 4.31648 7.05025 7.05015C6.65973 7.44067 6.02656 7.44067 5.63604 7.05015C5.24551 6.65962 5.24551 6.02646 5.63604 5.63593C9.15076 2.12121 14.8492 2.12121 18.364 5.63593C18.7545 6.02646 18.7545 6.65962 18.364 7.05015C17.9734 7.44067 17.3403 7.44067 16.9497 7.05015Z"
        ></path>
      </svg>
      <span>Loading...</span>
    </div>
  );

  return (
    <div className="p-10">
      <h1 className="py-4 text-center font-semibold">
        Biconomy SDK | Next.js | Web3Auth
      </h1>

      <div className="flex justify-center">
        {!account ? (
          connectWeb3Loading || (socialLoginSDK?.provider && !scwAddress) ? (
            <Button variant="outlined" size="md" className="cursor-not-allowed">
              <ButtonLoadingAnimation />
            </Button>
          ) : (
            <div>
              <Button
                className="m-auto"
                variant="outlined"
                size="md"
                onClick={connectWeb3}
              >
                Login
              </Button>
            </div>
          )
        ) : (
          <div>
            <Button
              className="m-auto"
              variant="outlined"
              size="md"
              onClick={disconnectWeb3}
            >
              Logout
            </Button>
            <section className="mt-10 rounded-lg bg-gray-100 p-6">
              <div className="my-2">
                <h2 className="font-semibold">EOA Address</h2>
                {account && scwAddress ? (
                  <p>{account}</p>
                ) : (
                  <Skeleton width={400} />
                )}
              </div>

              <div className="my-2">
                <h2 className="font-semibold">Smart Account Addresss</h2>
                {account && scwAddress ? (
                  <p>{scwAddress}</p>
                ) : (
                  <Skeleton width={400} />
                )}
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;