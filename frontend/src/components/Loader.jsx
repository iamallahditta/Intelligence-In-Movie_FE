const Loader = ({
  height = "400px",
  spinnerSize = "40px",
  spinnerColor = "border-navy_blue",
  text = "Loading…",
  subtext = "Please wait while we process your request",
}) => {
  return (
    <div
      className="flex flex-col items-center justify-center space-y-2"
      style={{ height }}
    >
      <div
        className={`animate-spin border-4 ${spinnerColor} border-t-transparent rounded-full`}
        style={{ width: spinnerSize, height: spinnerSize }}
      />
      <p className="text-lg font-medium text-text_black">{text}</p>
      {subtext && <p className="text-sm text-gray">{subtext}</p>}
    </div>
  );
};

export default Loader;
