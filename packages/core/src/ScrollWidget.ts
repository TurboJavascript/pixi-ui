import { InteractiveGroup } from './InteractiveGroup';
import { Helpers }  from './Helpers';
import { Ticker } from './Ticker';
import { DragManager } from './event/DragManager';
import { ScrollManager } from './event/ScrollManager';
import * as PIXI from 'pixi.js';
import { Widget } from './Widget';
import { WidgetGroup } from './WidgetGroup';

/**
 * @namespace PUXI
 * @interface
 */
interface IScrollingContainerOptions
{
    scrollX?: boolean;
    scrollY?: boolean;
    dragScrolling?: boolean;
    softness?: number;
    radius?: number;
    expandMask?: number;
    overflowY?: number;
    overflowX?: number;
}

/**
 * `ScrollWidget` masks its contents to its layout bounds and translates
 * its children when scrolling.
 *
 * @memberof PUXI
 * @class
 * @extends PUXI.InteractiveGroup
 */
export class ScrollWidget extends InteractiveGroup
{
    private mask: PIXI.Graphics;
    private innerContainer: WidgetGroup;
    private innerBounds: PIXI.Rectangle;

    scrollX: boolean;
    scrollY: boolean;
    dragScrolling: boolean;
    softness: number;
    radius: number;
    expandMask: number;
    overflowY: number;
    overflowX: number;

    animating: boolean;
    scrolling: boolean;

    _scrollBars: any[];
    private boundCached: number;
    private lastWidth: number;
    private lastHeight: number;

    protected scrollPosition: PIXI.Point;
    protected scrollVelocity: PIXI.Point;
    protected targetPosition: PIXI.Point;
    protected lastPosition: PIXI.Point;
    protected stop: boolean;

    /**
     * @param {PUXI.IScrollingContainerOptions} options
     * @param [options.scrollX=false] {Boolean} Enable horizontal scrolling
     * @param [options.scrollY=false] {Boolean} Enable vertical scrolling
     * @param [options.dragScrolling=true] {Boolean} Enable mousedrag scrolling
     * @param [options.softness=0.5] {Number} (0-1) softness of scrolling
     * @param [options.width=0] {Number|String} container width
     * @param [options.height=0] {Number} container height
     * @param [options.radius=0] {Number} corner radius of clipping mask
     * @param [options.expandMask=0] {Number} mask expand (px)
     * @param [options.overflowY=0] {Number} how much can be scrolled past content dimensions
     * @param [options.overflowX=0] {Number} how much can be scrolled past content dimensions
     */
    constructor(options: IScrollingContainerOptions = {})
    {
        super();

        this.mask = new PIXI.Graphics();
        this.innerContainer = new InteractiveGroup();
        this.innerBounds = new PIXI.Rectangle();
        super.addChild(this.innerContainer);
        this.contentContainer.addChild(this.mask);
        this.contentContainer.mask = this.mask;

        this.scrollX = options.scrollX !== undefined ? options.scrollX : false;
        this.scrollY = options.scrollY !== undefined ? options.scrollY : false;
        this.dragScrolling = options.dragScrolling !== undefined ? options.dragScrolling : true;
        this.softness = options.softness !== undefined ? Math.max(Math.min(options.softness || 0, 1), 0) : 0.5;
        this.radius = options.radius || 0;
        this.expandMask = options.expandMask || 0;
        this.overflowY = options.overflowY || 0;
        this.overflowX = options.overflowX || 0;

        this.scrollVelocity = new PIXI.Point();

        /**
         * Widget's position in a scroll.
         * @member {PIXI.Point}
         * @private
         */
        this.scrollPosition = new PIXI.Point();

        /**
         * Position that the cursor is at, i.e. our scroll "target".
         * @member {PIXI.Point}
         * @private
         */
        this.targetPosition = new PIXI.Point();
        this.lastPosition = new PIXI.Point();

        this.animating = false;
        this.scrolling = false;
        this._scrollBars = [];

        this.boundCached = performance.now() - 1000;
        this.initScrolling();
    }

    /**
     * Updates the mask and scroll position before rendering.
     *
     * @override
     */
    update(): void
    {
        super.update();

        if (this.lastWidth !== this.width || this.lastHeight !== this.height)
        {
            const of = this.expandMask;

            this.mask.clear();
            this.mask.lineStyle(0);
            this.mask.beginFill(0xFFFFFF, 1);

            if (this.radius === 0)
            {
                this.mask.drawRect(-of, -of, this.width + of, this.height + of);
            }
            else
            {
                this.mask.drawRoundedRect(-of, -of, this.width + of, this.height + of, this.radius);
            }

            this.mask.endFill();

            this.lastWidth = this.width;
            this.lastHeight = this.height;
        }

        this.setScrollPosition();
    }

    /**
     * @param {PUXI.Widget[]} newChildren
     * @returns {ScrollWidget} this widget
     */
    addChild(...newChildren: Widget[]): Widget
    {
        for (let i = 0; i < newChildren.length; i++)
        {
            this.innerContainer.addChild(newChildren[i]);
        }

        this.getInnerBounds(true); // make sure bounds is updated instantly when a child is added

        return this;
    }

    updateScrollBars(): void
    {
        for (let i = 0; i < this._scrollBars.length; i++)
        {
            this._scrollBars[i].alignToContainer();
        }
    }

    getInnerBounds(force?: boolean): PIXI.Rectangle
    {
        // this is a temporary fix, because we cant rely on innercontainer height if the children is positioned > 0 y.
        if (force || performance.now() - this.boundCached > 1000)
        {
            this.innerContainer.insetContainer.getLocalBounds(this.innerBounds);
            this.innerContainer.insetContainer.getLocalBounds(this.innerBounds);
            this.innerBounds.height = this.innerBounds.y + this.innerContainer.height;
            this.innerBounds.width = this.innerBounds.x + this.innerContainer.width;
            this.boundCached = performance.now();
        }

        return this.innerBounds;
    }

    /**
     * @override
     */
    initialize(): void
    {
        super.initialize();

        if (this.scrollX || this.scrollY)
        {
            this.initScrolling();
        }
    }

    private initScrolling(): void
    {
        const container = this.innerContainer.insetContainer;
        const realPosition = new PIXI.Point();
        const {
            scrollPosition,
            targetPosition,
        } = this;

        // Drag scroll
        if (this.dragScrolling)
        {
            const drag: DragManager = this.eventBroker.dnd as DragManager;

            drag.onDragStart = (e): void =>
            {
                if (!this.scrolling)
                {
                    realPosition.copyFrom(container.position);
                    scrollPosition.copyFrom(container.position);
                    this.scrolling = true;
                    this.setScrollPosition();

                    this.emit('scrollstart', e);
                }
            };

            drag.onDragMove = (_, offset): void =>
            {
                if (this.scrollX)
                {
                    targetPosition.x = realPosition.x + offset.x;
                }
                if (this.scrollY)
                {
                    targetPosition.y = realPosition.y + offset.y;
                }
            };

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            drag.onDragEnd = (e): void =>
            {
                if (this.scrolling)
                {
                    this.scrolling = false;
                    this.emit('scrollend', e);
                }
            };
        }

        // Mouse scroll
        const scrollSpeed = new PIXI.Point();
        const scroll = new ScrollManager(this, true);

        scroll.onMouseScroll = (e, delta: PIXI.Point): void =>
        {
            scrollSpeed.set(-delta.x * 0.2, -delta.y * 0.2);
            this.setScrollPosition(scrollSpeed);
        };

        this.updateScrollBars();
    }

    forcePctPosition = (direction: string, pct: number): void =>
    {
        const bounds = this.getInnerBounds();
        const container = this.innerContainer.insetContainer;

        if (this.scrollX && direction === 'x')
        {
            container.position[direction] = -((bounds.width - this.width) * pct);
        }
        if (this.scrollY && direction === 'y')
        {
            container.position[direction] = -((bounds.height - this.height) * pct);
        }

        this.scrollPosition[direction] = this.targetPosition[direction] = container.position[direction];
    };

    focusPosition = (pos: PIXI.Point): void =>
    {
        const bounds = this.getInnerBounds();
        const container = this.innerContainer.insetContainer;

        let dif;

        if (this.scrollX)
        {
            const x = Math.max(0, (Math.min(bounds.width, pos.x)));

            if (x + container.x > this.width)
            {
                dif = x - this.width;
                container.x = -dif;
            }
            else if (x + container.x < 0)
            {
                dif = x + container.x;
                container.x -= dif;
            }
        }
        if (this.scrollY)
        {
            const y = Math.max(0, (Math.min(bounds.height, pos.y)));

            if (y + container.y > this.height)
            {
                dif = y - this.height;
                container.y = -dif;
            }
            else if (y + container.y < 0)
            {
                dif = y + container.y;
                container.y -= dif;
            }
        }

        this.lastPosition.copyFrom(container.position);
        this.targetPosition.copyFrom(container.position);
        this.scrollPosition.copyFrom(container.position);

        this.updateScrollBars();
    };

    /**
     * @param {PIXI.Point}[velocity]
     */
    setScrollPosition = (velocity?: PIXI.Point): void =>
    {
        if (velocity)
        {
            this.scrollVelocity.copyFrom(velocity);
        }

        const container = this.innerContainer.insetContainer;

        if (!this.animating)
        {
            this.animating = true;

            this.lastPosition.copyFrom(container.position);
            this.targetPosition.copyFrom(container.position);

            Ticker.on('update', this.updateScrollPosition, this);
        }
    };

    /**
     * @param {number} delta
     * @protected
     */
    protected updateScrollPosition = (delta: number): void =>
    {
        this.stop = true;

        if (this.scrollX)
        {
            this.updateDirection('x', delta);
        }
        if (this.scrollY)
        {
            this.updateDirection('y', delta);
        }

        if (stop)
        {
            Ticker.removeListener('update', this.updateScrollPosition);
            this.animating = false;
        }
    };

    /**
     * @param {'x' | 'y'} direction
     * @param {number} delta
     * @protected
     */
    protected updateDirection = (direction: string, delta: number): void =>
    {
        const bounds = this.getInnerBounds();
        const {
            scrollPosition,
            scrollVelocity,
            targetPosition,
            lastPosition,
        } = this;
        const container = this.innerContainer.insetContainer;

        let min;

        if (direction === 'y')
        {
            min = Math.round(Math.min(0, this.height - bounds.height));
        }
        else
        {
            min = Math.round(Math.min(0, this.width - bounds.width));
        }

        if (!this.scrolling && Math.round(scrollVelocity[direction]) !== 0)
        {
            targetPosition[direction] += scrollVelocity[direction];
            scrollVelocity[direction] = Helpers.Lerp(
                scrollVelocity[direction],
                0,
                (5 + 2.5 / Math.max(this.softness, 0.01)) * delta);

            if (targetPosition[direction] > 0)
            {
                targetPosition[direction] = 0;
            }
            else if (targetPosition[direction] < min)
            {
                targetPosition[direction] = min;
            }
        }

        if (!this.scrolling
            && Math.round(scrollVelocity[direction]) === 0
            && (container[direction] > 0
            || container[direction] < min))
        {
            const target = this.scrollPosition[direction] > 0 ? 0 : min;

            scrollPosition[direction] = Helpers.Lerp(
                scrollPosition[direction],
                target,
                (40 - (30 * this.softness)) * delta);
            this.stop = false;
        }
        else if (this.scrolling || Math.round(scrollVelocity[direction]) !== 0)
        {
            if (this.scrolling)
            {
                scrollVelocity[direction] = this.scrollPosition[direction] - lastPosition[direction];
                lastPosition.copyFrom(scrollPosition);
            }
            if (targetPosition[direction] > 0)
            {
                scrollVelocity[direction] = 0;
                scrollPosition[direction] = 100 * this.softness * (1 - Math.exp(targetPosition[direction] / -200));
            }
            else if (targetPosition[direction] < min)
            {
                scrollVelocity[direction] = 0;
                scrollPosition[direction] = min - (100 * this.softness * (1 - Math.exp((min - targetPosition[direction]) / -200)));
            }
            else
            {
                scrollPosition[direction] = targetPosition[direction];
            }

            this.stop = false;
        }

        container.position[direction] = Math.round(scrollPosition[direction]);
        this.updateScrollBars();
    };

    /**
     * This is fired when the user starts scrolling.
     * @event scrollstart
     */

    /**
     * This is fired when the user stops scrolling.
     * @event scrollend
     */
}
