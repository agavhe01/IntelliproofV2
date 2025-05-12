'use client';

import styles from './Team.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faInstagram, faTwitter, faLinkedin } from '@fortawesome/free-brands-svg-icons';

const Team = () => {
    return (
        <div className={styles.teamSection}>
            <h1 className={styles.header}>Meet the Team</h1>
            <div className={styles.slider}>
                <input type="radio" name="card" id="c-1" />
                <input type="radio" name="card" id="c-2" />
                <input type="radio" name="card" id="c-3" defaultChecked />
                <input type="radio" name="card" id="c-4" />
                <input type="radio" name="card" id="c-5" />

                <div className={styles.cards}>
                    <label htmlFor="c-1" className={styles.item}>
                        <div className={styles.main_content}>
                            <div className={styles.img}>
                                <img src="/images/pic1.avif" alt="John Doe" />
                            </div>
                            <div className={styles.content}>
                                <h1>John Doe</h1>
                                <h4>Front End Developer</h4>

                                <div className={styles.social}>
                                    <div className={styles.icon}>
                                        <a href="#"><FontAwesomeIcon icon={faFacebook} style={{ color: '#3b5998' }} /></a>
                                    </div>
                                    <div className={styles.icon}>
                                        <a href="#"><FontAwesomeIcon icon={faInstagram} style={{ color: '#e14664' }} /></a>
                                    </div>
                                    <div className={styles.icon}>
                                        <a href="#"><FontAwesomeIcon icon={faTwitter} style={{ color: '#00acee' }} /></a>
                                    </div>
                                    <div className={styles.icon}>
                                        <a href="#"><FontAwesomeIcon icon={faLinkedin} style={{ color: '#0077b5' }} /></a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </label>

                    <label htmlFor="c-2" className={styles.item}>
                        <div className={styles.main_content}>
                            <div className={styles.img}>
                                <img src="/images/pic2.jpg" alt="Michael Lucas" />
                            </div>
                            <div className={styles.content}>
                                <h1>Mike Lucas</h1>
                                <h4>Back End Developer</h4>

                                <div className={styles.social}>
                                    <div className={styles.icon}>
                                        <a href="#"><FontAwesomeIcon icon={faFacebook} style={{ color: '#3b5998' }} /></a>
                                    </div>
                                    <div className={styles.icon}>
                                        <a href="#"><FontAwesomeIcon icon={faInstagram} style={{ color: '#e14664' }} /></a>
                                    </div>
                                    <div className={styles.icon}>
                                        <a href="#"><FontAwesomeIcon icon={faTwitter} style={{ color: '#00acee' }} /></a>
                                    </div>
                                    <div className={styles.icon}>
                                        <a href="#"><FontAwesomeIcon icon={faLinkedin} style={{ color: '#0077b5' }} /></a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </label>

                    <label htmlFor="c-3" className={styles.item}>
                        <div className={styles.main_content}>
                            <div className={styles.img}>
                                <img src="/images/pic3.avif" alt="Henry Elijah" />
                            </div>
                            <div className={styles.content}>
                                <h1>Henry Elijah</h1>
                                <h4>Graphics Designer</h4>

                                <div className={styles.social}>
                                    <div className={styles.icon}>
                                        <a href="#"><FontAwesomeIcon icon={faFacebook} style={{ color: '#3b5998' }} /></a>
                                    </div>
                                    <div className={styles.icon}>
                                        <a href="#"><FontAwesomeIcon icon={faInstagram} style={{ color: '#e14664' }} /></a>
                                    </div>
                                    <div className={styles.icon}>
                                        <a href="#"><FontAwesomeIcon icon={faTwitter} style={{ color: '#00acee' }} /></a>
                                    </div>
                                    <div className={styles.icon}>
                                        <a href="#"><FontAwesomeIcon icon={faLinkedin} style={{ color: '#0077b5' }} /></a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </label>

                    <label htmlFor="c-4" className={styles.item}>
                        <div className={styles.main_content}>
                            <div className={styles.img}>
                                <img src="/images/pic4.avif" alt="Alexander Leo" />
                            </div>
                            <div className={styles.content}>
                                <h1>Alex Leo</h1>
                                <h4>Data Analyst</h4>

                                <div className={styles.social}>
                                    <div className={styles.icon}>
                                        <a href="#"><FontAwesomeIcon icon={faFacebook} style={{ color: '#3b5998' }} /></a>
                                    </div>
                                    <div className={styles.icon}>
                                        <a href="#"><FontAwesomeIcon icon={faInstagram} style={{ color: '#e14664' }} /></a>
                                    </div>
                                    <div className={styles.icon}>
                                        <a href="#"><FontAwesomeIcon icon={faTwitter} style={{ color: '#00acee' }} /></a>
                                    </div>
                                    <div className={styles.icon}>
                                        <a href="#"><FontAwesomeIcon icon={faLinkedin} style={{ color: '#0077b5' }} /></a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </label>

                    <label htmlFor="c-5" className={styles.item}>
                        <div className={styles.main_content}>
                            <div className={styles.img}>
                                <img src="/images/pic5.avif" alt="David Joseph" />
                            </div>
                            <div className={styles.content}>
                                <h1>Dave Joseph</h1>
                                <h4>Full Stack Developer</h4>

                                <div className={styles.social}>
                                    <div className={styles.icon}>
                                        <a href="#"><FontAwesomeIcon icon={faFacebook} style={{ color: '#3b5998' }} /></a>
                                    </div>
                                    <div className={styles.icon}>
                                        <a href="#"><FontAwesomeIcon icon={faInstagram} style={{ color: '#e14664' }} /></a>
                                    </div>
                                    <div className={styles.icon}>
                                        <a href="#"><FontAwesomeIcon icon={faTwitter} style={{ color: '#00acee' }} /></a>
                                    </div>
                                    <div className={styles.icon}>
                                        <a href="#"><FontAwesomeIcon icon={faLinkedin} style={{ color: '#0077b5' }} /></a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </label>
                </div>

                <div className={styles.dots}>
                    <label htmlFor="c-1"></label>
                    <label htmlFor="c-2"></label>
                    <label htmlFor="c-3"></label>
                    <label htmlFor="c-4"></label>
                    <label htmlFor="c-5"></label>
                </div>
            </div>
        </div>
    );
};

export default Team; 