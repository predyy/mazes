import type { NextPage } from 'next'
import Head from 'next/head'
import { useState } from 'react'
import Maze from '../components/Maze'
import styles from '../styles/pages/Home.module.scss'

import infoIcon from '../public/icons/info.svg';
import settingsIcon from '../public/icons/settings.svg';
import { Settings } from '../components/Settings'

const Home: NextPage = () => {
	const [ seed, setSeed ] = useState("defaultSeed");
	const [ size, setSize ] = useState(10)
	const [ settingsVisible, setSettingsVisible ] = useState(false);


  	return (
		<>
			<Settings 
				visible={settingsVisible} 
				close={ () => { setSettingsVisible(false)} }
			/>
			<main className={ styles.main }>
				<div className={ styles.container }>	
					<div className={ styles.headline }>
						<div className={ styles.iconButton }>
							<img alt="info" src={infoIcon.src} />
						</div>
						<h1>
							predyy.io#Mazes	
						</h1>		
						<div className={ styles.iconButton }>
							<img alt="settings" src={settingsIcon.src} onClick={ () => setSettingsVisible(true) }/>	
						</div>		
					</div>
					
					<Maze 
						seed={ seed } 
						size={ size } 
					/>	
				</div>				
			</main>

			<footer className={ styles.footer }>
				Footer
			</footer>
		</>
  	)
}

export default Home
