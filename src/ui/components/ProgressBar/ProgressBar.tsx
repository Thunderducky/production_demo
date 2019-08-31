import React from 'react';

/**
 * Properties for the Progress bar props class, every argument is currently optional except percentDone
 */
interface ProgressBarProps {
  /**
   * how many "sections" there are
   */
  segments?: number;
  /**
   * how completed it is, should be an integer between 1 and 100, only required parameter, defaults to 100
   */
  percentDone: number;
  /**
   * how wide the element is in css, defaults to 200
   */
  width?: number;
  /**
   * how tall the elment is defaults to 20
   */
  height?: number;
  /**
   * color of the outline of the progress bar
   */
  outlineColor?: string;
  /**
   * color of the interior
   */
  interiorColor?: string;

  /**
   * Color of the text
   */
  textColor?: string
  /**
   * Provide a label for the item
   */
  label?: string;
}
const ProgressBar: React.FC<ProgressBarProps> = ({segments = 100, percentDone=0, width=200, height=20, outlineColor="white", interiorColor="white", textColor="black", label=""}) => {
  const outerProgressBarStyle = {
    margin:1,
    width:width-2,              // to account for the outline
    outline:`solid 1px ${outlineColor}`,
    height:height-2,            // to account for the outline
    boxSizing: ("border-box" as "border-box"),
    position: ("relative" as "relative")
  }
  let segmentSize = Math.round(100/(segments || 1)); // divide 100 by the number of segments to get the segment size and then round it

  // make sure we stay in bounds
  if(segmentSize > 100){ segmentSize = 100}
  else if(segmentSize < 0){ segmentSize = 0}

  // how many segements have we filled up
  const progressPercent = percentDone === 100 ? 100 : percentDone - percentDone % segmentSize
  const innerProgressBarStyle = {
    width:`${progressPercent}%`,
    height:"100%",
    margin:0,
    padding:0,
    backgroundColor:interiorColor,
    lineHeight: height + "px",
    fontSize: height-4 + "px",
    position: "absolute" as "absolute"
  }
  const textStyle = {
    color: textColor,
    lineHeight: height + "px",
    fontSize: height-4 + "px",
    position: "absolute" as "absolute"
  }

  return (
    <div style={outerProgressBarStyle}>
      <div style={innerProgressBarStyle}></div>
      <div style={textStyle}>{label}</div>
    </div>
  );
}

export default ProgressBar;
