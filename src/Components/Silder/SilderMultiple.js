import ReactSlider from "react-slider";
import styled from "styled-components";

const StyledTrack = styled.div`
  top: 0;
  bottom: 0;
  background: ${(props) => props.index === 1 && "#30BC97"};
  z-index: ${(props) => props.index === 1 && "1"};
  border-radius: 999px;
`;

const Track = (props, state) => <StyledTrack {...props} index={state.index} />;

const SliderMultiple = (props) => {
  return (
    <div>
      <ReactSlider
        thumbClassName="flex items-center justify-center text-xs outline-none cursor-pointer bg-green text-white font-bold rounded-full p-2 w-fit h-6 -translate-y-7 shadow-lg shadow-green"
        trackClassName="rounded-lg h-2 bg-slate-300"
        defaultValue={[props.min, props.max]}
        min={0}
        max={10000}
        renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
        renderTrack={Track}
        pearling
        withTracks={true}
        onChange={props.onChange}
      />
    </div>
  );
};

export default SliderMultiple;
