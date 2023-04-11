import React, { useMemo, useEffect, useRef } from "react";
import { Icon } from "../../Icons";
import { useAudio, useToggle, useFullscreen } from "react-use";
import { secondsToTime } from "../../utils";
import CustomRange from "../CustomRange";
import { useDispatch, useSelector } from "react-redux";
import { setControls, setPlaying } from "../../stores/player";
import FullScreenPlayer from "../FullScreenPlayer";

export default function Player() {
  const fullscreenRef = useRef();
  const [show, toggle] = useToggle(false);
  const isFullscreen = useFullscreen(fullscreenRef, show, {
    onClose: () => toggle(false),
  });

  const { current } = useSelector((state) => state.player);

  const dispatch = useDispatch();

  const [audio, state, controls, ref] = useAudio({
    src: current?.songUrl,
  });

  useEffect(() => {
    controls.play();
  }, [current]);

  useEffect(() => {
    dispatch(setPlaying(state.playing));
  }, [state.playing]);

  useEffect(() => {
    dispatch(setControls(controls));
  }, []);

  const volumeIcon = useMemo(() => {
    if (state.volume === 0 || state.muted) {
      return "muted";
    }
    if (state.volume > 0 && state.volume < 0.33) {
      return "lowvolume";
    }
    if (state.volume > 0.33 && state.volume < 0.66) {
      return "normalvolume";
    }

    return "highvolume";
  }, [state.volume, state.muted]);

  const STEP = 0.1;
  const MIN = 0;

  return (
    <div className="flex px-4 justify-between items-center h-full">
      {/* LEFT */}
      <div className="min-w-[11.25rem] w-[30%]">
        {current && (
          <div className="flex items-center">
            <div className="flex items-center mr-3">
              <div className="w-14 h-14 mr-3 flex-shrink-0">
                <img src={current?.album.coverImageUrl} />
              </div>
              <div>
                <h6 className="text-sm line-clamp-1">{current.name}</h6>
                <p className="text-[0.688rem] text-white text-opacity-70">
                  {current.album.artist.name}
                </p>
              </div>
            </div>
            <button className="h-8 w-8 flex items-center justify-center text-white text-opacity-70 hover:text-opacity-100">
              <Icon name="like" size={16} />
            </button>
            <button className="h-8 w-8 flex items-center justify-center text-white text-opacity-70 hover:text-opacity-100">
              <Icon name="picinpic" size={16} />
            </button>
          </div>
        )}
      </div>
      {/* MIDDLE */}
      <div className="flex flex-col items-center max-w-[45.125rem] w-[40%] px-4">
        <div className="flex items-center gap-x-2">
          <button className="h-8 w-8 flex items-center justify-center text-white text-opacity-70 hover:text-opacity-100">
            <Icon name="shuffle" size={16} />
          </button>
          <button className="h-8 w-8 flex items-center justify-center text-white text-opacity-70 hover:text-opacity-100">
            <Icon name="playerprev" size={16} />
          </button>
          <button
            onClick={controls[state?.playing ? "pause" : "play"]}
            className="h-8 w-8 flex items-center justify-center bg-white text-black rounded-full hover:scale-[1.06]"
          >
            <Icon name={`${state?.playing ? "pause" : "play"}`} size={16} />
          </button>
          <button className="h-8 w-8 flex items-center justify-center text-white text-opacity-70 hover:text-opacity-100">
            <Icon name="playernext" size={16} />
          </button>
          <button className="h-8 w-8 flex items-center justify-center text-white text-opacity-70 hover:text-opacity-100">
            <Icon name="repeat" size={16} />
          </button>
        </div>
        <div className="w-full flex items-center gap-x-2">
          {audio}
          <div className="text-[0.688rem] text-white text-opacity-70">
            {secondsToTime(state?.time)}
          </div>
          <CustomRange
            value={state?.time}
            step={0.1}
            min={0}
            max={state?.duration || 1}
            onChange={(value) => controls.seek(value)}
          />
          <div className="text-[0.688rem] text-white text-opacity-70">
            {secondsToTime(state?.duration)}
          </div>
        </div>
      </div>
      {/* RIGHT */}
      <div className="min-w-[11.25rem] w-[30%] flex items-center justify-end">
        <button className="h-8 w-8 flex items-center justify-center text-white text-opacity-70 hover:text-opacity-100">
          <Icon name="lyrics" size={16} />
        </button>
        <button className="h-8 w-8 flex items-center justify-center text-white text-opacity-70 hover:text-opacity-100">
          <Icon name="queue" size={16} />
        </button>
        <button className="h-8 w-8 flex items-center justify-center text-white text-opacity-70 hover:text-opacity-100">
          <Icon name="device" size={16} />
        </button>
        <button
          onClick={controls[state.muted ? "unmute" : "mute"]}
          className="h-8 w-8 flex items-center justify-center text-white text-opacity-70 hover:text-opacity-100"
        >
          <Icon name={volumeIcon} size={16} />
        </button>
        <div className="w-[5.813rem] max-w-full">
          <CustomRange
            value={state.muted ? "0" : state?.volume}
            step={0.01}
            min={0}
            max={1}
            onChange={(value) => {
              controls.unmute();
              controls.volume(value);
            }}
          />
        </div>

        <button
          onClick={toggle}
          className="h-8 w-8 flex items-center justify-center text-white text-opacity-70 hover:text-opacity-100"
        >
          <Icon name="fullscreen" size={16} />
        </button>
      </div>
      <div ref={fullscreenRef}>
        {isFullscreen && (<FullScreenPlayer toggle={toggle} state={state} controls={controls}/>)}
      </div>
    </div>
  );
}
