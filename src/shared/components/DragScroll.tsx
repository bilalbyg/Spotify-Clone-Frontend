import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type DragEvent,
  type HTMLAttributes,
  type MouseEvent,
  type PointerEvent,
} from 'react';

export type DragScrollProps = HTMLAttributes<HTMLDivElement> & {
  containerClassName?: string;
  disabled?: boolean;
  dragSpeed?: number;
  dragThreshold?: number;
  nextLabel?: string;
  previousLabel?: string;
  scrollStep?: number;
  showEdgeControls?: boolean;
};

type DragState = {
  active: boolean;
  dragged: boolean;
  pointerId: number | null;
  startX: number;
  startY: number;
  startScrollLeft: number;
};

const createInitialDragState = (): DragState => ({
  active: false,
  dragged: false,
  pointerId: null,
  startX: 0,
  startY: 0,
  startScrollLeft: 0,
});

export function DragScroll({
  children,
  className,
  containerClassName,
  disabled = false,
  dragSpeed = 1,
  dragThreshold = 6,
  nextLabel = 'Scroll right',
  previousLabel = 'Scroll left',
  scrollStep,
  showEdgeControls = true,
  onClickCapture,
  onDragStartCapture,
  onPointerCancel,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  style,
  ...rest
}: DragScrollProps) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const dragStateRef = useRef<DragState>(createInitialDragState());
  const suppressClickRef = useRef(false);
  const clickResetTimeoutRef = useRef<number | null>(null);
  const [hoverEdge, setHoverEdge] = useState<'left' | 'right' | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = useCallback(() => {
    const scroller = scrollerRef.current;

    if (!scroller) {
      return;
    }

    const hasOverflow = scroller.scrollWidth > scroller.clientWidth + 1;
    const hasMoreOnLeft = scroller.scrollLeft > 1;
    const hasMoreOnRight = scroller.scrollLeft + scroller.clientWidth < scroller.scrollWidth - 1;

    setCanScrollLeft(hasOverflow && hasMoreOnLeft);
    setCanScrollRight(hasOverflow && hasMoreOnRight);
  }, []);

  useEffect(() => {
    const scroller = scrollerRef.current;

    if (!scroller) {
      return;
    }

    let animationFrameId = window.requestAnimationFrame(updateScrollState);
    const scheduleScrollStateUpdate = () => {
      window.cancelAnimationFrame(animationFrameId);
      animationFrameId = window.requestAnimationFrame(updateScrollState);
    };

    const resizeObserver = new ResizeObserver(scheduleScrollStateUpdate);
    const mutationObserver = new MutationObserver(scheduleScrollStateUpdate);

    scroller.addEventListener('scroll', scheduleScrollStateUpdate, { passive: true });
    window.addEventListener('resize', scheduleScrollStateUpdate);
    resizeObserver.observe(scroller);
    mutationObserver.observe(scroller, {
      childList: true,
      subtree: true,
    });

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      scroller.removeEventListener('scroll', scheduleScrollStateUpdate);
      window.removeEventListener('resize', scheduleScrollStateUpdate);
      resizeObserver.disconnect();
      mutationObserver.disconnect();

      if (clickResetTimeoutRef.current !== null) {
        window.clearTimeout(clickResetTimeoutRef.current);
      }
    };
  }, [updateScrollState]);

  const resetDrag = useCallback((event?: PointerEvent<HTMLDivElement>) => {
    const scroller = scrollerRef.current;
    const dragState = dragStateRef.current;

    if (!dragState.active) {
      return;
    }

    if (event && scroller?.hasPointerCapture(event.pointerId)) {
      scroller.releasePointerCapture(event.pointerId);
    }

    if (dragState.dragged) {
      suppressClickRef.current = true;

      if (clickResetTimeoutRef.current !== null) {
        window.clearTimeout(clickResetTimeoutRef.current);
      }

      clickResetTimeoutRef.current = window.setTimeout(() => {
        suppressClickRef.current = false;
        clickResetTimeoutRef.current = null;
      }, 0);
    }

    dragStateRef.current = createInitialDragState();
  }, []);

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    onPointerDown?.(event);

    if (
      event.defaultPrevented ||
      disabled ||
      !event.isPrimary ||
      (event.pointerType === 'mouse' && event.button !== 0)
    ) {
      return;
    }

    const target = event.target as HTMLElement;

    if (target.closest('button, input, textarea, select, [data-drag-scroll-ignore]')) {
      return;
    }

    dragStateRef.current = {
      active: true,
      dragged: false,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startScrollLeft: event.currentTarget.scrollLeft,
    };

    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    onPointerMove?.(event);

    const dragState = dragStateRef.current;

    if (
      event.defaultPrevented ||
      disabled ||
      !dragState.active ||
      dragState.pointerId !== event.pointerId
    ) {
      return;
    }

    const deltaX = event.clientX - dragState.startX;
    const deltaY = event.clientY - dragState.startY;

    if (!dragState.dragged) {
      if (Math.abs(deltaX) < dragThreshold) {
        return;
      }

      if (event.pointerType !== 'mouse' && Math.abs(deltaX) <= Math.abs(deltaY)) {
        return;
      }

      dragState.dragged = true;
    }

    event.preventDefault();
    event.currentTarget.scrollLeft = dragState.startScrollLeft - deltaX * dragSpeed;
  };

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    onPointerUp?.(event);
    resetDrag(event);
  };

  const handlePointerCancel = (event: PointerEvent<HTMLDivElement>) => {
    onPointerCancel?.(event);
    resetDrag(event);
  };

  const handleClickCapture = (event: MouseEvent<HTMLDivElement>) => {
    if (suppressClickRef.current) {
      event.preventDefault();
      event.stopPropagation();
      suppressClickRef.current = false;
    }

    onClickCapture?.(event);
  };

  const handleDragStartCapture = (event: DragEvent<HTMLDivElement>) => {
    onDragStartCapture?.(event);

    if (!event.defaultPrevented) {
      event.preventDefault();
    }
  };

  const handleContainerMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    if (!showEdgeControls) {
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const cursorX = event.clientX - rect.left;
    const edgeThreshold = Math.min(96, rect.width * 0.16);

    if (cursorX <= edgeThreshold) {
      setHoverEdge('left');
      return;
    }

    if (cursorX >= rect.width - edgeThreshold) {
      setHoverEdge('right');
      return;
    }

    setHoverEdge(null);
  };

  const scrollByDirection = (direction: -1 | 1) => {
    const scroller = scrollerRef.current;

    if (!scroller) {
      return;
    }

    const distance = scrollStep ?? Math.max(280, Math.round(scroller.clientWidth * 0.72));

    scroller.scrollBy({
      left: direction * distance,
      behavior: 'smooth',
    });
  };

  return (
    <div
      className={['relative', containerClassName].filter(Boolean).join(' ')}
      onMouseLeave={() => setHoverEdge(null)}
      onMouseMove={handleContainerMouseMove}
    >
      <div
        {...rest}
        ref={scrollerRef}
        className={['cursor-grab select-none active:cursor-grabbing', className]
          .filter(Boolean)
          .join(' ')}
        style={{
          touchAction: disabled ? 'auto' : 'pan-y',
          overscrollBehaviorInline: 'contain',
          ...style,
        }}
        onClickCapture={handleClickCapture}
        onDragStartCapture={handleDragStartCapture}
        onPointerCancel={handlePointerCancel}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        {children}
      </div>

      {showEdgeControls && canScrollLeft && hoverEdge === 'left' && (
        <>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-zinc-950 via-zinc-950/75 to-transparent" />
          <button
            type="button"
            data-drag-scroll-ignore
            onClick={() => scrollByDirection(-1)}
            aria-label={previousLabel}
            className="absolute left-2 top-1/2 z-10 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-zinc-800/90 text-zinc-100 shadow-lg shadow-black/60 transition hover:scale-105 hover:bg-zinc-700"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5 rotate-180 fill-current" aria-hidden="true">
              <path d="m7.05 3.606 13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606" />
            </svg>
          </button>
        </>
      )}

      {showEdgeControls && canScrollRight && hoverEdge === 'right' && (
        <>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-zinc-950 via-zinc-950/75 to-transparent" />
          <button
            type="button"
            data-drag-scroll-ignore
            onClick={() => scrollByDirection(1)}
            aria-label={nextLabel}
            className="absolute right-2 top-1/2 z-10 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-zinc-800/90 text-zinc-100 shadow-lg shadow-black/60 transition hover:scale-105 hover:bg-zinc-700"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
              <path d="m7.05 3.606 13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606" />
            </svg>
          </button>
        </>
      )}
    </div>
  );
}
