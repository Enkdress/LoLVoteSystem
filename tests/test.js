const anchor = require('@project-serum/anchor');
const { SystemProgram } = anchor.web3;

const main = async() => {
  console.log("🚀 Starting test...")

  const provider = anchor.Provider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Pokemon;
  const baseAccount = anchor.web3.Keypair.generate();
  let tx = await program.rpc.initialize({
    accounts: {
      baseAccount: baseAccount.publicKey,
      user: provider.wallet.publicKey,
      systemProgram: SystemProgram.programId,
    },
    signers: [baseAccount],
  });
  console.log("📝 Your transaction signature", tx);

  let account = await program.account.baseAccount.fetch(baseAccount.publicKey);
  console.log('Total votes', account.totalVotes.toString())

  await program.rpc.vote("Pikachu", "Bulbasur", "Bulbasur", {
    accounts: {
      baseAccount: baseAccount.publicKey,
    },
  });

  await program.rpc.vote("Pikachu", "Bulbasur", "Bulbasur", {
    accounts: {
      baseAccount: baseAccount.publicKey,
    },
  });
  
  await program.rpc.vote("Pikachu", "Bulbasur", "Pikachu", {
    accounts: {
      baseAccount: baseAccount.publicKey,
    },
  });

  // Call the account.
  account = await program.account.baseAccount.fetch(baseAccount.publicKey);
  console.log('Total votes', account.totalVotes.toString())

  // Access gif_list on the account!
  console.log('Pairs', account.pokemonPairs)
}

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

runMain();
