import {Composition} from 'remotion';
import {TopPageVideo} from './TopPageVideo';

export const RemotionRoot = () => {
  return (
    <Composition
      id="TopPageVideo"
      component={TopPageVideo}
      durationInFrames={1495}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};
