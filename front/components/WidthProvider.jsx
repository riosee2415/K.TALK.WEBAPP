import { useEffect, useState } from "react";

const WidthProvider = ({ children }) => {
  const [width, setWidth] = useState(0);

  const handleResize = () => setWidth(window.innerWidth);

  useEffect(() => {
    window.addEventListener("resize", handleResize);

    setTimeout(() => {
      handleResize();
    }, 1000);

    setWidth(window.innerWidth);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (width === 0) {
    return null;
  }

  if (Array.isArray(children)) {
    return children.map((data) => {
      return { ...data, props: { ...data.props, width } };
    });
  } else {
    return { ...children, props: { ...children.props, width } };
  }
};

export const withWidth = (WrappedComponent) => {
  return (props) => {
    const [width, setWidth] = useState(0);

    const handleResize = () => setWidth(window.innerWidth);

    useEffect(() => {
      window.addEventListener("resize", handleResize);

      setTimeout(() => {
        handleResize();
      }, 1000);

      setWidth(window.innerWidth);

      return () => window.removeEventListener("resize", handleResize);
    }, []);

    if (width === 0) {
      return null;
    }

    return <WrappedComponent width={width} {...props} />;
  };
};

export default WidthProvider;
