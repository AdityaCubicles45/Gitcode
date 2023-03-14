import { useHuddleStore } from '@huddle01/huddle01-client/store';
import React, { useCallback, useEffect, useRef } from 'react';
import huddleClient from '../utils/huddleClient';

const ShareVideoElem = () => {
  const videoRef = useRef(null);
  const screenSharePeerId = useHuddleStore((state) => state.screenSharePeerId);

  const peerCamTrack = useHuddleStore(
    useCallback(
      (state) => {
        if (screenSharePeerId === huddleClient.peerId) return state.producers.share?.track;
        if (screenSharePeerId && screenSharePeerId !== huddleClient.peerId) return state.peers[screenSharePeerId].consumers?.share.track;
      },
      [screenSharePeerId]
    )
  );

  const getStream = (_track) => {
    const stream = new MediaStream();
    stream.addTrack(_track);
    return stream;
  };

  useEffect(() => {
    const videoObj = videoRef.current;

    if (videoObj && peerCamTrack) {
      videoObj.load();
      videoObj.srcObject = getStream(peerCamTrack);
      videoObj.play().catch((err) => {
        console.log({
          message: 'Error playing video',
          meta: {
            err,
          },
        });
      });
    }

    return () => {
      if (videoObj) {
        videoObj?.pause();
        videoObj.srcObject = null;
      }
    };
  }, [peerCamTrack]);

  return (
    <div style={{ width: '100%' }}>
      <video ref={videoRef} muted autoPlay playsInline style={{ width: '100%' }} />
    </div>
  );
};

export default React.memo(ShareVideoElem);
