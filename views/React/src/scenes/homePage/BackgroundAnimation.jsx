import React from 'react';
import { styled, keyframes } from '@mui/system';

const fallAnimation = keyframes`
  0% {
    transform: translateY(-10px) scale(0);
    opacity: 1;
  }
  50% {
    opacity: 1;
  }
  100% {
    transform: translateY(calc(${(props) => props.translateY} + 333vh)) scale(1);
    opacity: 0;
  }
`;

const SnowContainer = styled('div')`
  height: ${(props) => props.height};
  background: linear-gradient(180deg, rgba(6,0,71,1) 0%, rgba(179,0,94,1) 91%, rgba(233,0,100,1) 100%, rgba(233,0,100,1) 100%);
  overflow: hidden;
  filter: drop-shadow(0 0 10px white);
  position: relative;
`;

const Snowflake = styled('div')`
  position: absolute;
  width: 30px;
  height: 30px;
  background: #E90064;
  border-radius: 50%;
  opacity: 0;
  animation: ${fallAnimation} 600s linear infinite;
  animation-delay: 0s; /* Set constant delay of 0s for all snowflakes */

  &:nth-of-type(1) {
    animation-delay: -3s;
  }
  &:nth-of-type(2) {
    animation-delay: -6s;
  }
  &:nth-of-type(3) {
    animation-delay: -9s;
  }
  /* Add more nth-child rules as needed */
`;

const generateRandomScale = () => {
  return Math.random() * 0.5 + 0.5; // Random scale between 0.5 and 1
};

const BackgroundAnimation = ({ height, translateY }) => {
  const numSnowflakes = 100; // Adjust the number of snowflakes here

  const generateSnowflakes = () => {
    const snowflakes = [];

    for (let i = 0; i < numSnowflakes; i++) {
      const randomX = `${Math.random() * 100}vw`;
      const randomYoyoTime = Math.random() * 0.5 + 0.3; // Random yoyo time between 0.3 and 0.8
      const randomYoyoY = `${randomYoyoTime * 330}vh`;

      snowflakes.push(
        <Snowflake
          key={i}
          style={{
            left: randomX,
            transform: `translateY(${translateY}) scale(${generateRandomScale()})`,
            animationDuration: `${Math.random() * 100 + 50}s`, // Random duration between 50s and 150s
            animationTimingFunction: `cubic-bezier(${Math.random()}, ${Math.random()}, ${Math.random()}, ${Math.random()})`, // Random cubic-bezier values
            animationIterationCount: Math.random() > 0.5 ? 'infinite' : 'alternate', // Randomly set infinite or alternate
            animationDirection: Math.random() > 0.5 ? 'normal' : 'reverse', // Randomly set normal or reverse
            animationFillMode: 'both',
          }}
        />
      );
    }

    return snowflakes;
  };

  return <SnowContainer height={height}>{generateSnowflakes()}</SnowContainer>;
};

export default BackgroundAnimation;
