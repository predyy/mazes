import styles from '../styles/components/Settings.module.scss'
import closeIcon from '../public/icons/close.svg';

export interface SettingsProps {
    visible: boolean
    close: Function
}

export const Settings: React.FC<SettingsProps> = (props: SettingsProps) => { 
    const { visible, close } = props; 

    return (visible ? 
    <div className={ styles.settingsWrapper }>
        <div className={ styles.settings }>
            <div className={ styles.close } onClick={() => { close() }}>
                <img alt="close" src={ closeIcon.src } />
            </div>
            <h2>Settings</h2>
            <h3>Difficulty</h3>
            <div className={ styles.options }>
                <div>Easy</div>
                <div>Medium</div>
                <div>Hard</div>
                <div>Extreme</div>
            </div>
            <h3>Visibility</h3>
            <div>On/Off</div>
            <h3>Maze cycles</h3>
            <div>On/Off</div>
            <h3>Maze Data</h3>
        </div>
    </div> : <></>)
}