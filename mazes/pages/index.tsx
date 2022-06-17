import type { NextPage } from 'next'
import Head from 'next/head'
import { useState } from 'react'
import Maze from '../components/Maze'
import styles from '../styles/pages/Home.module.scss'

const Home: NextPage = () => {
	const [ seed, setSeed ] = useState("defaultSeed");
	const [ size, setSize ] = useState(10)

  	return (
		<>
			<Head>
				<title>Mazes | predyy.io</title>
				<meta name="description" content="Learn how to solve mazes online. Compete against timer or solve in least amount of moves. Comapre with your friends." />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<main className={ styles.main }>
				<div className={ styles.container }>					
					<Maze 
						seed={ seed } 
						size={ size } 
					/>					

					<div className={ styles.column }>
						Right col
					</div>
				</div>				
			</main>

			<footer className={ styles.footer }>
				Footer
			</footer>
		</>
  	)
}

export default Home
