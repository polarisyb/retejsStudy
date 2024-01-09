import Image from 'next/image'
import styles from './page.module.css'

export default function Home() {
  return (
    <main className={styles.main}>
      <h1 className={styles.title}>
        Welcome to <a href="http://localhost:3000/test/test01">test01!</a>
      </h1>
    </main>
  )
}
