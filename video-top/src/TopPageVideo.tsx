import {Video} from '@remotion/media';
import {
  AbsoluteFill,
  CanvasImage,
  Easing,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

const VISUAL_END = 1386;
const TOTAL_DURATION = 1495;

const segments = [
  {from: 0, duration: 204, trimBefore: 0, sourceDuration: 240},
  {from: 204, duration: 213, trimBefore: 240, sourceDuration: 195},
  {from: 417, duration: 201, trimBefore: 435, sourceDuration: 270},
  {from: 618, duration: 195, trimBefore: 705, sourceDuration: 255},
  {from: 813, duration: 135, trimBefore: 960, sourceDuration: 255},
  {from: 948, duration: 147, trimBefore: 1215, sourceDuration: 126},
  {from: 1095, duration: 81, trimBefore: 1341, sourceDuration: 153},
  {from: 1176, duration: 210, trimBefore: 1494, sourceDuration: 173},
];

const BrandBars = () => (
  <>
    <div style={{position: 'absolute', inset: '0 auto auto 0', width: '39%', height: 8, background: '#00d3e2'}} />
    <div style={{position: 'absolute', inset: '0 31% auto auto', width: '30%', height: 8, background: '#7c36f2'}} />
    <div style={{position: 'absolute', inset: '0 0 auto auto', width: '31%', height: 8, background: '#ff6500'}} />
  </>
);

const EndCard = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        background: '#070d20',
        color: '#f7f9fc',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: interpolate(frame, [0, fps], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        }),
      }}
    >
      <BrandBars />
      <div style={{width: 920, padding: 36, background: '#f7f9fc', borderLeft: '12px solid #00d3e2', borderRight: '12px solid #ff6500', boxShadow: 'inset 0 -8px 0 #7c36f2'}}>
        <CanvasImage src={staticFile('company-wordmark.png')} style={{width: '100%', height: 170, objectFit: 'contain'}} />
      </div>
      <div style={{marginTop: 54, fontFamily: 'Arial, sans-serif', fontSize: 46, fontWeight: 800, letterSpacing: '-0.03em'}}>
        構想を、動く仕組みと伝わる体験へ。
      </div>
      <div style={{marginTop: 22, fontFamily: 'Arial, sans-serif', fontSize: 24, color: '#aeb9cc', letterSpacing: '0.16em'}}>
        DEVELOPMENT <span style={{color: '#7c36f2'}}>と</span> EXPRESSION
      </div>
    </AbsoluteFill>
  );
};

export const TopPageVideo = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{background: '#070d20'}}>
      <AbsoluteFill
        style={{
          opacity: interpolate(frame, [0, 22, VISUAL_END - 18, VISUAL_END], [0, 1, 1, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
        }}
      >
        {segments.map((segment) => (
          <Sequence key={segment.from} from={segment.from} durationInFrames={segment.duration}>
            <Video
              src={staticFile('top-page.webm')}
              trimBefore={segment.trimBefore}
              playbackRate={segment.sourceDuration / segment.duration}
              muted
              style={{width: '100%', height: '100%', objectFit: 'cover'}}
            />
          </Sequence>
        ))}
        <BrandBars />
      </AbsoluteFill>
      <Sequence from={VISUAL_END} durationInFrames={TOTAL_DURATION - VISUAL_END}>
        <EndCard />
      </Sequence>
    </AbsoluteFill>
  );
};
