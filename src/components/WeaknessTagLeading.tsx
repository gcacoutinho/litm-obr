import type { ReactElement } from 'react';
import weaknessTagSvg from '../assets/weakness-tag.svg?raw';

const WeaknessTagLeading = (): ReactElement => {
  const svgMarkup: string = weaknessTagSvg;
  return (
    <div
      className="weakness-tag-leading"
      dangerouslySetInnerHTML={{ __html: svgMarkup }}
    />
  );
};

export default WeaknessTagLeading;
