import * as anchor from "@project-serum/anchor";
import { useState } from "react";

interface UpdatePostProps {
  blog: any;
  blogAccount: anchor.web3.PublicKey;
  program: anchor.Program;
  provider: anchor.Provider;
  onCreate: () => void;
}

function UpdatePost({
  blog,
  blogAccount,
  program,
  provider,
  onCreate,
}: UpdatePostProps) {
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

      await program.rpc.updateProfile(title, body, {
        accounts: {
          profileAccount: blogAccount,
          userAccount: postAccount,
          authority: provider.wallet.publicKey,
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
      <h3>Update your profile</h3>
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
        {loading ? "Publishing..." : "Update"}
      </button>
    </>
  );
}

export default UpdatePost;
