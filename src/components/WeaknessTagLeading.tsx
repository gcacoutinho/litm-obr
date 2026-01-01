import weaknessTagSvg from '../assets/weakness-tag.svg?raw';

const WeaknessTagLeading = () => {
  return (
    <div
      className="weakness-tag-leading"
      dangerouslySetInnerHTML={{ __html: weaknessTagSvg }}
    />
  );
};

export default WeaknessTagLeading;
