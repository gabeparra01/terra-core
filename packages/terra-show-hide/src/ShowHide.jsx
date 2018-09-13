import React from 'react';
import PropTypes from 'prop-types';
import Toggle from 'terra-toggle';
import IconChevronDown from 'terra-icon/lib/icon/IconChevronDown';
import classNames from 'classnames/bind';
import 'terra-base/lib/baseStyles';
import styles from './ShowHide.module.scss';
import Button from './_ShowHideButton';

const cx = classNames.bind(styles);

const propTypes = {
  /**
   * Content in the body of the component that will be shown or hidden
   */
  children: PropTypes.node.isRequired,
  /**
   * Text that will be visible to the user while the component is collapsed
   */
  preview: PropTypes.string.isRequired,
  /**
   * Button text that will be displayed when the component is collapsed
   */
  collapsedButtonText: PropTypes.string,
  /**
   * Button text that will be displayed when the component is expanded
   */
  expandedButtonText: PropTypes.string,
  /**
   * Icon displayed next to the button text
   */
  icon: PropTypes.element,
  /**
   * Sets the animation for the component when it is expanded or collapsed
   */
  isAnimated: PropTypes.bool,
  /**
   * Sets the initial state of the component to open and expanded
   */
  isInitiallyOpen: PropTypes.bool,
  /**
   * Callback function triggered when the component is collapsed
   */
  onClose: PropTypes.func,
  /**
   * Callback function triggered when the component is expanded
   */
  onOpen: PropTypes.func,
};

const defaultProps = {
  collapsedButtonText: 'Show More',
  expandedButtonText: 'Hide',
  icon: <IconChevronDown />,
  isAnimated: false,
  isInitiallyOpen: false,
};

class ShowHide extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: props.isInitiallyOpen,
    };

    this.handleOnClick = this.handleOnClick.bind(this);
  }

  handleOnClick(e) {
    e.preventDefault();

    // Fire event from toggle handlers
    if (!this.state.isOpen && this.props.onOpen) {
      this.props.onOpen();
    } else if (this.state.isOpen && this.props.onClose) {
      this.props.onClose();
    }

    this.setState(prevState => ({
      isOpen: !prevState.isOpen,
    }));
  }

  render() {
    const {
      collapsedButtonText,
      children,
      expandedButtonText,
      icon,
      isAnimated,
      isInitiallyOpen,
      onClose,
      onOpen,
      preview,
      ...customProps
    } = this.props;

    const buttonText = !this.state.isOpen ? collapsedButtonText : expandedButtonText;
    const showHideClassName = cx([
      'button',
      { 'is-open': this.state.isOpen },
      customProps.className,
    ]);

    let previewText = '';

    if (preview) {
      if (preview.slice(-1) === '.') {
        previewText = `${preview}..`;
      } else {
        previewText = `${preview}...`;
      }
    }

    const button = (
      <Button
        icon={<span className={cx('icon')}>{icon}</span>}
        aria-expanded={this.state.isOpen}
        text={buttonText}
        onClick={this.handleOnClick}
      />
    );

    let isAnimatedStyle = {};

    if (this.props.isAnimated) {
      isAnimatedStyle = {
        // fix for the toggle oscillation when setting isAnimated to true
        transitionDelay: '0.3s',
        WebkitTransitionDelay: '0.3s', /* Safari */
      };
    }

    return (
      <div {...customProps} className={showHideClassName}>
        {!this.state.isOpen && previewText}
        <Toggle isOpen={this.state.isOpen} isAnimated={this.props.isAnimated} style={isAnimatedStyle}>
          {this.props.children}
        </Toggle>
        {button}
      </div>
    );
  }
}

ShowHide.propTypes = propTypes;
ShowHide.defaultProps = defaultProps;

export default ShowHide;
