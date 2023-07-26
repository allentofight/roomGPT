import { useEffect } from 'react';
import { motion, useAnimation } from "framer-motion";

function RingLoading() {
    const controls1 = useAnimation();
    const controls2 = useAnimation();
    const controls3 = useAnimation();

    useEffect(() => {
        controls1.start({
            r: ["6px", "22px"],
            strokeOpacity: [1, 0],
            strokeWidth: ["2px", "0px"],
            transition: { duration: 3, repeat: Infinity, delay: 1.5 }
        });

        controls2.start({
            r: ["6px", "22px"],
            strokeOpacity: [1, 0],
            strokeWidth: ["2px", "0px"],
            transition: { duration: 3, repeat: Infinity, delay: 3 }
        });

        controls3.start({
            r: ["6px", "1px", "2px", "3px", "4px", "5px", "6px"],
            transition: { duration: 1.5, repeat: Infinity }
        });

    }, [controls1, controls2, controls3]);

    return (

        <div className="" data-testid="rings-loading" aria-label="rings-loading" aria-busy="true" role="status" style={{ display: 'flex' }}>
            <svg width="200" height="200" viewBox="0 0 45 45" xmlns="http://www.w3.org/2000/svg" stroke="white" data-testid="rings-svg">
                <g fill="none" fill-rule="evenodd" transform="translate(1 1)" stroke-width="2">
                    <motion.circle cx="22" cy="22" r="6" stroke-opacity="0" animate={controls1}></motion.circle>
                    <motion.circle cx="22" cy="22" r="6" stroke-opacity="0" animate={controls2}></motion.circle>
                    <motion.circle cx="22" cy="22" r="8" animate={controls3}></motion.circle>
                </g>
            </svg>
        </div>
    );
}

export default RingLoading;
