"use client";

import { doLogout } from "@/actions/session";
import { useSession } from "@/contexts/session-context";
import styles from "./page.module.css";

export default function Home() {
  const { isLoading, user, logout } = useSession();

  if (isLoading) {
    return "authenticating...";
  }

  return (
    <main className={styles.main}>
      <center>
        <h1>Hello {user?.name}!</h1>
        <button onClick={logout}>logout</button>
      </center>
    </main>
  );
}
