import * as anchor from "@project-serum/anchor";
import { useState } from "react";

interface CreatePostProps {
  blog: any;
  blogAccount: anchor.web3.PublicKey;
  program: anchor.Program;
  provider: anchor.Provider;
  onCreate: () => void;
}

function CreatePost({
  blog,
  blogAccount,
  program,
  provider,
  onCreate,
}: CreatePostProps) {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  async function handlePublish() {
    setLoading(true);

    try {
      const [postAccount, postAccountBump] =
        await anchor.web3.PublicKey.findProgramAddress(
          [
            provider.wallet.publicKey.toBuffer(),
          ],
          program.programId
        );

      await program.rpc.createProfile(postAccountBump, title, body, {
        accounts: {
          profileAccount: blogAccount,
          userAccount: postAccount,
          authority: provider.wallet.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        },
      });
      setTitle("");
      setBody("");
      onCreate();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <h3>Create a new profile</h3>
      <div>
        <label>
          Name:
          <input value={title} onChange={(e) => setTitle(e.target.value)} />
        </label>
      </div>
      <div>
        <label>
          Location:
          <textarea
            rows={5}
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
        </label>
      </div>
      <button disabled={loading} onClick={handlePublish}>
        {loading ? "Publishing..." : "Create"}
      </button>
    </>
  );
}

export default CreatePost;
