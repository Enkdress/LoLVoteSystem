import { useEffect, useState, useCallback } from "react";
import { web3, Program, Provider, Idl } from "@project-serum/anchor";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";

import kp from "../../lib/keypair.json";
import idl from "../../lib/idl.json";

declare global {
  interface Window {
    solana: any;
  }
}

const useSolana = () => {
  const solanaNetwork: web3.Cluster = "devnet";
  const [network, setNetwork] = useState<string>("");
  const [opts, setOpts] = useState<web3.ConfirmOptions>({
    preflightCommitment: "processed",
  });
  const [provider, setProvider] = useState<Provider | null>(null);
  const [programID, setProgramID] = useState<web3.PublicKey | null>(null);
  const [program, setProgram] = useState<Program<Idl> | null>(null);
  const [baseAccount, setBaseAccount] = useState<web3.Keypair | null>(null);
  const [walletAddress, setWalletAddress] = useState<string>("");

  const getBaseAccount = () => {
    try {
      const arr: number[] = Object.values(kp._keypair.secretKey);
      const secret = new Uint8Array(arr);
      let keypair = web3.Keypair.fromSecretKey(secret);
      setBaseAccount(keypair);
    } catch (e) {
      console.error("Error in getBasicAccount: " + e);
    }
  };

  const getProvider = useCallback(() => {
    try {
      if (network != "") {
        const { solana } = window;
        const connection = new Connection(network, opts.preflightCommitment);
        const _provider = new Provider(
          connection,
          solana,
          opts.preflightCommitment! as web3.ConfirmOptions
        );
        setProvider(_provider);
      }
    } catch (e) {
      console.error("Error in getProvider: " + e);
    }
  }, [setProvider, network, opts]);

  const connectWallet = async () => {
    if (!walletAddress) {
      try {
        const { solana } = window;
        if (solana) {
          const response = await solana.connect();
          console.log(
            "Connected with Public Key:",
            response.publicKey.toString()
          );
          setWalletAddress(response.publicKey.toString());
        }
      } catch (e) {
        console.error("Error in connectWallet: " + e);
      }
    }
  };

  const checkIsWalletConnected = async () => {
    try {
      const { solana } = window;

      if (solana) {
        if (solana.isPhantom) {
          const response = await solana.connect({ onlyIfTrusted: true });

          console.log(
            "Connected with Public Key:",
            response.publicKey.toString()
          );

          setWalletAddress(response.publicKey.toString());
        }
      } else {
        alert("Solana object not found!   Get a phantom wallet 👻");
      }
    } catch (error) {
      console.error("Error in CheckWallet: " + error);
    }
  };

  useEffect(() => {
    if (typeof window !== undefined) {
      let publicKey = new PublicKey(idl.metadata.address);
      let net = clusterApiUrl(solanaNetwork);
      setNetwork(net);
      setProgramID(publicKey);
      getBaseAccount();
      getProvider();
    }
  }, [getProvider]);

  useEffect(() => {
    if (typeof window !== undefined) {
      if (provider && programID) {
        let _program = new Program(idl as Idl, programID, provider);
        setProgram(_program);
      }
    }
  }, [programID, provider]);

  useEffect(() => {
    if (typeof window !== undefined) {
      window.addEventListener(
        "load",
        async () => await checkIsWalletConnected()
      );
    }
  }, []);

  return {
    connectWallet,
    walletAddress,
    program: program?.rpc,
    programAccount: program?.account,
    publicKey: baseAccount?.publicKey,
    baseAccount,
    wallet: provider?.wallet,
  };
};

export default useSolana;
