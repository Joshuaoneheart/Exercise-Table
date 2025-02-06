import { useEffect, useState } from "react";
import styled, { css } from "styled-components";
import Portal from "./Portal";
import useOuterClick from "hooks/outerClick";

const topStyle = css`
  transform: translate(
    calc(${(props) => props.childrenSize.width / 2}px - 50%),
    calc(-100% - ${(props) => props.gap}px)
  );
  .tooltip-arrow {
    position: absolute;
    left: 50%;
    transform: translate(-50%, 40%);
  }
  .tooltip-arrow-content {
    width: 8px;
    height: 8px;
    transform: rotate(45deg);
    background: ${(props) => props.$color};
  }
`;

const topLeftStyle = css`
  transform: translate(0px, calc(-100% - ${(props) => props.gap}px));
  .tooltip-arrow {
    position: absolute;
    left: 12px;
    transform: translate(0%, 40%);
  }
`;

const topRightStyle = css`
  transform: translate(
    calc(-100% + ${(props) => props.childrenSize.width}px),
    calc(-100% - ${(props) => props.gap}px)
  );
  .tooltip-arrow {
    position: absolute;
    right: 12px;
    transform: translate(0%, 40%);
  }
`;

const bottomStyle = css`
  transform: translate(
    calc(${(props) => props.childrenSize.width / 2}px - 50%),
    ${(props) => props.childrenSize.height + props.gap}px
  );
  .tooltip-arrow {
    position: absolute;
    top: 0px;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`;

const bottomLeftStyle = css`
  transform: translate(
    0px,
    ${(props) => props.childrenSize.height + props.gap}px
  );
  .tooltip-arrow {
    position: absolute;
    top: 0px;
    left: 12px;
    transform: translate(0%, -50%);
  }
`;

const bottomRightStyle = css`
  transform: translate(
    calc(-100% + ${(props) => props.childrenSize.width}px),
    ${(props) => props.childrenSize.height + props.gap}px
  );
  .tooltip-arrow {
    position: absolute;
    top: 0px;
    right: 12px;
    transform: translate(0%, -50%);
  }
`;

const rightTopStyle = css`
  transform: translate(
    ${(props) => props.childrenSize.width + props.gap}px,
    0px
  );
  .tooltip-arrow {
    position: absolute;
    top: 12px;
    left: 0px;
    transform: translate(-50%, 0%);
  }
`;

const rightBottomStyle = css`
  transform: translate(
    ${(props) => props.childrenSize.width + props.gap}px,
    calc(-100% + ${(props) => props.childrenSize.height}px)
  );
  .tooltip-arrow {
    position: absolute;
    bottom: 12px;
    left: 0px;
    transform: translate(-50%, 0%);
  }
`;

const leftBottomStyle = css`
  transform: translate(
    calc(-100% - ${(props) => props.gap}px),
    calc(-100% + ${(props) => props.childrenSize.height}px)
  );
  .tooltip-arrow {
    position: absolute;
    bottom: 12px;
    right: 0px;
    transform: translate(50%, 0%);
  }
`;

const leftTopStyle = css`
  transform: translate(calc(-100% - ${(props) => props.gap}px), 0px);
  .tooltip-arrow {
    position: absolute;
    top: 12px;
    right: 0px;
    transform: translate(50%, 0%);
  }
`;

const leftStyle = css`
  transform: translate(
    calc(-100% - ${(props) => props.gap}px),
    calc(-50% + ${(props) => props.childrenSize.height / 2}px)
  );
  .tooltip-arrow {
    position: absolute;
    top: 50%;
    right: 0px;
    transform: translate(50%, -50%);
  }
`;

const rightStyle = css`
  transform: translate(
    ${(props) => props.childrenSize.width + props.gap}px,
    calc(-50% + ${(props) => props.childrenSize.height / 2}px)
  );
  .tooltip-arrow {
    position: absolute;
    top: 50%;
    left: 0px;
    transform: translate(-50%, -50%);
  }
`;

const TooltipWrapper = styled.div`
  position: absolute;
  z-index: 999;
  top: ${(props) => {
    return props.position.top + window.scrollY;
  }}px;
  left: ${(props) => props.position.left}px;
  box-shadow: 0 3px 6px -4px rgb(0 0 0 / 12%), 0 6px 16px 0 rgb(0 0 0 / 8%),
    0 9px 28px 8px rgb(0 0 0 / 5%);
  ${(props) => placementStyleMap[props.placement] || placementStyleMap.top}
  display: ${(props) => (props.show ? "block;" : "none;")}
  background-color: var(--p-300);
  border-radius: 8px;
  width: fit-content;
  padding: 8px;
  color: var(--white);
  .tooltip-arrow-content {
    width: 8px;
    height: 8px;
    transform: rotate(45deg);
    background-color: var(--p-300);
  }
`;

const placementStyleMap = {
  top: topStyle,
  "top-left": topLeftStyle,
  "top-right": topRightStyle,
  "bottom-left": bottomLeftStyle,
  "bottom-right": bottomRightStyle,
  bottom: bottomStyle,
  "right-top": rightTopStyle,
  "left-top": leftTopStyle,
  "right-bottom": rightBottomStyle,
  "left-bottom": leftBottomStyle,
  left: leftStyle,
  right: rightStyle,
};

const Tooltip = ({ text, children, span_style, placement = "top" }) => {
  const [position, setPosition] = useState({
    top: 0,
    left: 0,
  });
  const [childrenSize, setChildrenSize] = useState({
    width: 0,
    height: 0,
  });
  const [show, setShow] = useState(false);
  const childrenRef = useOuterClick(() => setShow(false));
  const handleOnResize = () => {
    if (childrenRef.current) {
      setChildrenSize({
        width: childrenRef.current.offsetWidth,
        height: childrenRef.current.offsetHeight,
      });
      setPosition({
        top: childrenRef.current.getBoundingClientRect().top,
        left: childrenRef.current.getBoundingClientRect().left,
      });
    }
  };

  useEffect(() => {
    handleOnResize();
    window.addEventListener("resize", handleOnResize);
    window.addEventListener("scroll", handleOnResize);
    return () => {
      window.removeEventListener("scroll", handleOnResize);
      window.removeEventListener("resize", handleOnResize);
    };
  }, []);
  return (
    <>
      <span
        ref={childrenRef}
        style={span_style}
        onClick={() => {
          setShow((s) => !s);
        }}
      >
        {children}
      </span>
      <Portal customRootId="content">
        <TooltipWrapper
          show={show}
          position={position}
          childrenSize={childrenSize}
          gap={12}
          placement={placement}
        >
          {text}
          <div className="tooltip-arrow">
            <div className="tooltip-arrow-content" />
          </div>
        </TooltipWrapper>
      </Portal>
    </>
  );
};
export default Tooltip;
