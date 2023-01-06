interface SlideEvent extends Event {
  target: EventTarget & {
    dataset: {
      key: string;
    };
  };
}

export { SlideEvent };
