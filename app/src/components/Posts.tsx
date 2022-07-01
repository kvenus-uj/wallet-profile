import * as anchor from "@project-serum/anchor";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";

interface PostsProps {
  blog: any;
  blogAccount: anchor.web3.PublicKey;
  program: anchor.Program;
  provider: anchor.Provider;
}

function Posts({ blog, blogAccount, program, provider }: PostsProps) {
  const wallet = useAnchorWallet();
  const [posts, setPosts] = useState<any>();

  useEffect(() => {
    async function fetchPosts() {
      try {
        console.log("fetching posts...");
          const [postAccount] = await anchor.web3.PublicKey.findProgramAddress(
            [
              provider.wallet.publicKey.toBuffer(),
            ],
            program.programId
          );

          const post = await program.account.userProfile.fetch(postAccount);
        setPosts(post);
      } catch (error) {
        console.log(error);
      }
    }

    fetchPosts();
  }, [blog, blogAccount, program, wallet]);

  return (
    <div>
      <h2>Profile</h2>
        <div>
          <h5>Name:  {posts?.name}</h5>
          <p>Location:  {posts?.location}</p>
          <p>Likes:  {posts?.likes}</p>
        </div>
    </div>
  );
}

export default Posts;
