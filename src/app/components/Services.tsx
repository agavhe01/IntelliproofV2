'use client';

import styles from './Services.module.css';
import ContinueButton from './ContinueButton';

const Services = () => {
    return (
        <div className={styles.servicesSection}>
            <h1 className={styles.header}>Our Services</h1>
            <div className={styles.container}>
                <div className={styles.card}>
                    <div className={`${styles.face} ${styles.face1}`}>
                        <div className={styles.content}>
                            <h2>Deep Learning</h2>
                            <p>Advanced neural network architectures for complex pattern recognition, image processing, and natural language understanding. Harness the power of deep neural networks for your most challenging AI tasks.</p>
                            <ContinueButton className="mt-4">Explore Solutions</ContinueButton>
                        </div>
                    </div>

                    <div className={`${styles.face} ${styles.face2}`}>
                        <h1>Deep Learning</h1>
                        <h2>01</h2>
                    </div>
                </div>

                <div className={styles.card}>
                    <div className={`${styles.face} ${styles.face1}`}>
                        <div className={styles.content}>
                            <h2>Machine Learning</h2>
                            <p>Custom ML solutions for predictive analytics, classification, and regression problems. From traditional algorithms to modern approaches, we help you build intelligent systems that learn and adapt.</p>
                            <ContinueButton className="mt-4">Learn More</ContinueButton>
                        </div>
                    </div>

                    <div className={`${styles.face} ${styles.face2}`}>
                        <h1>Machine Learning</h1>
                        <h2>02</h2>
                    </div>
                </div>

                <div className={styles.card}>
                    <div className={`${styles.face} ${styles.face1}`}>
                        <div className={styles.content}>
                            <h2>Neural Networks</h2>
                            <p>Specialized neural network implementations for complex data processing tasks. Design and deploy custom neural architectures optimized for your specific use cases and performance requirements.</p>
                            <ContinueButton className="mt-4">View Projects</ContinueButton>
                        </div>
                    </div>

                    <div className={`${styles.face} ${styles.face2}`}>
                        <h1>Neural Networks</h1>
                        <h2>03</h2>
                    </div>
                </div>

                <div className={styles.card}>
                    <div className={`${styles.face} ${styles.face1}`}>
                        <div className={styles.content}>
                            <h2>Data Analysis</h2>
                            <p>Comprehensive data analysis and visualization services. Transform raw data into actionable insights using advanced statistical methods and modern analytical tools.</p>
                            <ContinueButton className="mt-4">Get Started</ContinueButton>
                        </div>
                    </div>

                    <div className={`${styles.face} ${styles.face2}`}>
                        <h1>Data Analysis</h1>
                        <h2>04</h2>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Services;