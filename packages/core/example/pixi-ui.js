(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('pixi.js'), require('@pixi/filter-drop-shadow')) :
    typeof define === 'function' && define.amd ? define(['exports', 'pixi.js', '@pixi/filter-drop-shadow'], factory) :
    (global = global || self, factory(global.PUXI = {}, global.PIXI, global.PIXI.filters));
}(this, (function (exports, PIXI$1, filterDropShadow) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    const _items = [];
    const DragDropController = {
        add(item, event)
        {
            item._dragDropEventId = event.data.identifier;
            if (_items.indexOf(item) === -1)
            {
                _items.push(item);

                return true;
            }

            return false;
        },
        getItem(object)
        {
            let item = null; let
                index;

            for (let i = 0; i < _items.length; i++)
            {
                if (_items[i] === object)
                {
                    item = _items[i];
                    index = i;
                    break;
                }
            }

            if (item !== null)
            {
                _items.splice(index, 1);

                return item;
            }

            return false;
        },
        getEventItem(event, group)
        {
            let item = null; let index; const
                id = event.data.identifier;

            for (let i = 0; i < _items.length; i++)
            {
                if (_items[i]._dragDropEventId === id)
                {
                    if (group !== _items[i].dragGroup)
                    {
                        return false;
                    }
                    item = _items[i];
                    index = i;
                    break;
                }
            }

            if (item !== null)
            {
                _items.splice(index, 1);

                return item;
            }

            return false;
        },
    };

    /**
     * @memberof PUXI
     * @class
     */
    var Insets = /** @class */ (function () {
        function Insets() {
            this.reset();
            this.dirtyId = 0;
        }
        Insets.prototype.reset = function () {
            this.left = -1;
            this.top = -1;
            this.right = -1;
            this.bottom = -1;
        };
        return Insets;
    }());

    /**
     * These are the modes in which an entity can measures its dimension. They are
     * relevant when a layout needs to know the optimal sizes of its children.
     *
     * @memberof PUXI
     * @enum
     * @property {number} UNBOUNDED - no upper limit on bounds. This should calculate the optimal dimensions for the entity.
     * @property {number} EXACTLY - the entity should set its dimension to the one passed to it.
     * @property {number} AT_MOST - the entity should find an optimal dimension below the one passed to it.
     */
    (function (MeasureMode) {
        MeasureMode[MeasureMode["UNBOUNDED"] = 0] = "UNBOUNDED";
        MeasureMode[MeasureMode["EXACTLY"] = 1] = "EXACTLY";
        MeasureMode[MeasureMode["AT_MOST"] = 2] = "AT_MOST";
    })(exports.MeasureMode || (exports.MeasureMode = {}));
    /**
     * Any renderable entity that can be used in a widget hierarchy must be
     * measurable.
     *
     * @memberof PUXI
     * @interface IMeasurable
     */
    /**
     * Measures its width & height based on the passed constraints.
     *
     * @memberof PUXI.IMeasurable#
     * @method onMeasure
     * @param {number} maxWidth
     * @param {number} maxHeight
     * @param {PUXI.MeasureMode} widthMode
     * @param {PUXI.MeasureMode} heightMode
     */
    /**
     * @memberof PUXI.IMeasurable#
     * @method getMeasuredWidth
     * @returns {number} - the measured width of the entity after a `onMeasure` call
     */
    /**
     * @memberof PUXI.IMeasurable#
     * @method getMeasuredHeight
     * @returns {number} - the measured height of the entity after a `onMeasure` call
     */

    /**
     * An event manager handles the states related to certain events and can augment
     * widget interaction. For example, the click manager will hide clicks when
     * the object is dragging.
     *
     * Event managers are lifecycle objects - they can start/stop. Their constructor
     * will always accept one argument - the widget. Other settings can be applied before
     * `startEvent`.
     *
     * Ideally, you should access event managers _after_ your widget has initialized. This is
     * because it may depend on the widget's stage being assigned.
     *
     * @memberof PUXI
     * @class
     * @abstract
     */
    var EventManager = /** @class */ (function () {
        /**
         * @param {Widget} target
         */
        function EventManager(target) {
            this.target = target;
            this.isEnabled = false; // use to track start/stopEvent
        }
        /**
         * @returns {Widget}
         */
        EventManager.prototype.getTarget = function () {
            return this.target;
        };
        return EventManager;
    }());

    /**
     * `ClickManager` handles hover and click events. It registers listeners
     * for `mousedown`, `mouseup`, `mousemove`, `mouseout`, `mouseover`, `touchstart`,
     * `touchend`, `touchendoutside`, `touchmove`, `rightup`, `rightdown`, `rightupoutside`
     * events.
     *
     * @memberof PUXI
     * @class
     * @extends PUXI.EventManager
     */
    var ClickManager = /** @class */ (function (_super) {
        __extends(ClickManager, _super);
        /**
         * @param {PUXI.Widget | PUXI.Button} target
         * @param {boolean}[includeHover=false] - enable hover (`mouseover`, `mouseout`) listeners
         * @param {boolean}[rightMouseButton=false] - use right mouse clicks
         * @param {boolean}[doubleClick=false] - fire double clicks
         */
        function ClickManager(target, includeHover, rightMouseButton, doubleClick) {
            var _this = _super.call(this, target) || this;
            /**
             * @param {boolean}[includeHover]
             * @param {boolean}[rightMouseButton]
             * @param {boolean}[doubleClick]
             * @override
             */
            _this.startEvent = function (includeHover, rightMouseButton, doubleClick) {
                if (includeHover === void 0) { includeHover = _this._includeHover; }
                if (rightMouseButton === void 0) { rightMouseButton = _this._rightMouseButton; }
                if (doubleClick === void 0) { doubleClick = _this._doubleClick; }
                if (_this.isEnabled) {
                    return;
                }
                _this._includeHover = includeHover;
                _this.rightMouseButton = rightMouseButton;
                _this._doubleClick = doubleClick;
                var target = _this.target;
                target.insetContainer.on(_this.evMouseDown, _this.onMouseDownImpl);
                if (!_this._rightMouseButton) {
                    target.insetContainer.on('touchstart', _this.onMouseDownImpl);
                }
                if (_this._includeHover) {
                    target.insetContainer.on('mouseover', _this.onMouseOverImpl);
                    target.insetContainer.on('mouseout', _this.onMouseOutImpl);
                }
                _this.isEnabled = true;
            };
            /**
             * @override
             */
            _this.stopEvent = function () {
                if (!_this.isEnabled) {
                    return;
                }
                var target = _this.target;
                if (_this.bound) {
                    target.insetContainer.removeListener(_this.evMouseUp, _this.onMouseUpImpl);
                    target.insetContainer.removeListener(_this.evMouseUpOutside, _this.onMouseUpOutsideImpl);
                    if (!_this._rightMouseButton) {
                        target.insetContainer.removeListener('touchend', _this.onMouseUpImpl);
                        target.insetContainer.removeListener('touchendoutside', _this.onMouseUpOutsideImpl);
                    }
                    _this.bound = false;
                }
                target.insetContainer.removeListener(_this.evMouseDown, _this.onMouseDownImpl);
                if (!_this._rightMouseButton) {
                    target.insetContainer.removeListener('touchstart', _this.onMouseDownImpl);
                }
                if (_this._includeHover) {
                    target.insetContainer.removeListener('mouseover', _this.onMouseOverImpl);
                    target.insetContainer.removeListener('mouseout', _this.onMouseOutImpl);
                    target.insetContainer.removeListener('mousemove', _this.onMouseMoveImpl);
                    target.insetContainer.removeListener('touchmove', _this.onMouseMoveImpl);
                }
                _this.isEnabled = false;
            };
            _this.onMouseDownImpl = function (event) {
                var _a = _this, obj = _a.target, evMouseUp = _a.evMouseUp, _onMouseUp = _a.onMouseUpImpl, evMouseUpOutside = _a.evMouseUpOutside, _onMouseUpOutside = _a.onMouseUpOutsideImpl, right = _a._rightMouseButton;
                _this.mouse.copyFrom(event.data.global);
                _this.id = event.data.identifier;
                _this.onPress.call(_this.target, event, true);
                if (!_this.bound) {
                    obj.insetContainer.on(evMouseUp, _onMouseUp);
                    obj.insetContainer.on(evMouseUpOutside, _onMouseUpOutside);
                    if (!right) {
                        obj.insetContainer.on('touchend', _onMouseUp);
                        obj.insetContainer.on('touchendoutside', _onMouseUpOutside);
                    }
                    _this.bound = true;
                }
                if (_this._doubleClick) {
                    var now = performance.now();
                    if (now - _this.time < 210) {
                        _this.onClick.call(obj, event);
                    }
                    else {
                        _this.time = now;
                    }
                }
                event.data.originalEvent.preventDefault();
            };
            _this.onMouseUpCommonImpl = function (event) {
                var _a = _this, obj = _a.target, evMouseUp = _a.evMouseUp, _onMouseUp = _a.onMouseUpImpl, evMouseUpOutside = _a.evMouseUpOutside, _onMouseUpOutside = _a.onMouseUpOutsideImpl;
                if (event.data.identifier !== _this.id) {
                    return;
                }
                _this.offset.set(event.data.global.x - _this.mouse.x, event.data.global.y - _this.mouse.y);
                if (_this.bound) {
                    obj.insetContainer.removeListener(evMouseUp, _onMouseUp);
                    obj.insetContainer.removeListener(evMouseUpOutside, _onMouseUpOutside);
                    if (!_this._rightMouseButton) {
                        obj.insetContainer.removeListener('touchend', _onMouseUp);
                        obj.insetContainer.removeListener('touchendoutside', _onMouseUpOutside);
                    }
                    _this.bound = false;
                }
                _this.onPress.call(obj, event, false);
            };
            _this.onMouseUpImpl = function (event) {
                if (event.data.identifier !== _this.id) {
                    return;
                }
                _this.onMouseUpCommonImpl(event);
                // prevent clicks with scrolling/dragging objects
                if (_this.target.dragThreshold) {
                    _this.movementX = Math.abs(_this.offset.x);
                    _this.movementY = Math.abs(_this.offset.y);
                    if (Math.max(_this.movementX, _this.movementY) > _this.target.dragThreshold) {
                        return;
                    }
                }
                if (!_this._doubleClick) {
                    _this.onClick.call(_this.target, event);
                }
            };
            _this.onMouseUpOutsideImpl = function (event) {
                if (event.data.identifier !== _this.id) {
                    return;
                }
                _this.onMouseUpCommonImpl(event);
            };
            _this.onMouseOverImpl = function (event) {
                if (!_this.ishover) {
                    _this.ishover = true;
                    _this.target.insetContainer.on('mousemove', _this.onMouseMoveImpl);
                    _this.target.insetContainer.on('touchmove', _this.onMouseMoveImpl);
                    _this.onHover.call(_this.target, event, true);
                }
            };
            _this.onMouseOutImpl = function (event) {
                if (_this.ishover) {
                    _this.ishover = false;
                    _this.target.insetContainer.removeListener('mousemove', _this.onMouseMoveImpl);
                    _this.target.insetContainer.removeListener('touchmove', _this.onMouseMoveImpl);
                    _this.onHover.call(_this.target, event, false);
                }
            };
            _this.onMouseMoveImpl = function (event) {
                _this.onMove.call(_this.target, event);
            };
            _this.bound = false;
            _this.id = 0;
            _this.ishover = false;
            _this.mouse = new PIXI$1.Point();
            _this.offset = new PIXI$1.Point();
            _this.movementX = 0;
            _this.movementY = 0;
            _this._includeHover = typeof includeHover === 'undefined' ? true : includeHover;
            _this.rightMouseButton = typeof rightMouseButton === 'undefined' ? false : rightMouseButton;
            _this._doubleClick = typeof doubleClick === 'undefined' ? false : doubleClick;
            target.interactive = true;
            _this.time = 0;
            _this.startEvent();
            _this.onHover = function () { return null; };
            _this.onPress = function () { return null; };
            _this.onClick = function () { return null; };
            _this.onMove = function () { return null; };
            return _this;
        }
        Object.defineProperty(ClickManager.prototype, "rightMouseButton", {
            /**
             * Whether right mice are used for clicks rather than left mice.
             * @member boolean
             */
            get: function () {
                return this._rightMouseButton;
            },
            set: function (val) {
                this._rightMouseButton = val;
                this.evMouseDown = this._rightMouseButton ? 'rightdown' : 'mousedown';
                this.evMouseUp = this._rightMouseButton ? 'rightup' : 'mouseup';
                this.evMouseUpOutside = this._rightMouseButton ? 'rightupoutside' : 'mouseupoutside';
            },
            enumerable: true,
            configurable: true
        });
        return ClickManager;
    }(EventManager));

    /**
     * `DragManager` handles drag & drop events. It registers listeners for `mousedown`,
     * `touchstart` on the target and `mousemove`, `touchmove`, `mouseup`, `mouseupoutside`,
     * `touchend`, `touchendoutside` on the stage.
     *
     * By default, `draggable` widgets will internally handle drag-n-drop and reassigning
     * the callbacks on their `DragManager` will break their behaviour. You can prevent
     * this by using `eventBroker.dnd` directly without setting `widget.draggable` to
     * `true` (or using `widget.makeDraggable()`).
     *
     * @memberof PUXI
     * @class
     * @extends PUXI.EventManager
     */
    var DragManager = /** @class */ (function (_super) {
        __extends(DragManager, _super);
        function DragManager(target) {
            var _this = _super.call(this, target) || this;
            _this.onDragStartImpl = function (e) {
                var target = _this.target;
                _this.id = e.data.identifier;
                _this.onPress(e, true);
                if (!_this.isBound) {
                    _this.dragStart.copyFrom(e.data.global);
                    target.stage.on('mousemove', _this.onDragMoveImpl);
                    target.stage.on('touchmove', _this.onDragMoveImpl);
                    target.stage.on('mouseup', _this.onDragEndImpl);
                    target.stage.on('mouseupoutside', _this.onDragEndImpl);
                    target.stage.on('touchend', _this.onDragEndImpl);
                    target.stage.on('touchendoutside', _this.onDragEndImpl);
                    target.stage.on('touchcancel', _this.onDragEndImpl);
                    _this.isBound = true;
                }
                e.data.originalEvent.preventDefault();
            };
            _this.onDragMoveImpl = function (e) {
                if (e.data.identifier !== _this.id) {
                    return;
                }
                var _a = _this, lastCursor = _a.lastCursor, dragOffset = _a.dragOffset, dragStart = _a.dragStart, target = _a.target;
                _this.lastCursor.copyFrom(e.data.global);
                _this.dragOffset.set(lastCursor.x - dragStart.x, lastCursor.y - dragStart.y);
                if (!_this.isDragging) {
                    _this.movementX = Math.abs(dragOffset.x);
                    _this.movementY = Math.abs(dragOffset.y);
                    if ((_this.movementX === 0 && _this.movementY === 0)
                        || Math.max(_this.movementX, _this.movementY) < target.dragThreshold) {
                        return; // threshold
                    }
                    if (target.dragRestrictAxis !== null) {
                        _this.cancel = false;
                        if (target.dragRestrictAxis === 'x' && _this.movementY > _this.movementX) {
                            _this.cancel = true;
                        }
                        else if (target.dragRestrictAxis === 'y' && _this.movementY <= _this.movementX) {
                            _this.cancel = true;
                        }
                        if (_this.cancel) {
                            _this.onDragEndImpl(e);
                            return;
                        }
                    }
                    _this.onDragStart(e);
                    _this.isDragging = true;
                }
                _this.onDragMove(e, dragOffset);
            };
            _this.onDragEndImpl = function (e) {
                if (e.data.identifier !== _this.id) {
                    return;
                }
                var target = _this.target;
                if (_this.isBound) {
                    target.stage.removeListener('mousemove', _this.onDragMoveImpl);
                    target.stage.removeListener('touchmove', _this.onDragMoveImpl);
                    target.stage.removeListener('mouseup', _this.onDragEndImpl);
                    target.stage.removeListener('mouseupoutside', _this.onDragEndImpl);
                    target.stage.removeListener('touchend', _this.onDragEndImpl);
                    target.stage.removeListener('touchendoutside', _this.onDragEndImpl);
                    target.stage.removeListener('touchcancel', _this.onDragEndImpl);
                    _this.isDragging = false;
                    _this.isBound = false;
                    _this.onDragEnd(e);
                    _this.onPress(e, false);
                }
            };
            _this.isBound = false;
            _this.isDragging = false;
            _this.id = 0;
            _this.dragStart = new PIXI$1.Point();
            _this.dragOffset = new PIXI$1.Point();
            _this.lastCursor = new PIXI$1.Point();
            _this.movementX = 0;
            _this.movementY = 0;
            _this.cancel = false;
            _this.target.interactive = true;
            _this.onPress = function () { return null; };
            _this.onDragStart = function () { return null; };
            _this.onDragMove = function () { return null; };
            _this.onDragEnd = function () { return null; };
            _this.startEvent();
            return _this;
        }
        DragManager.prototype.startEvent = function () {
            if (this.isEnabled) {
                return;
            }
            var target = this.target;
            target.insetContainer.on('mousedown', this.onDragStartImpl);
            target.insetContainer.on('touchstart', this.onDragStartImpl);
            this.isEnabled = true;
        };
        DragManager.prototype.stopEvent = function () {
            if (!this.isEnabled) {
                return;
            }
            var target = this.target;
            if (this.isBound) {
                target.stage.removeListener('mousemove', this.onDragMoveImpl);
                target.stage.removeListener('touchmove', this.onDragMoveImpl);
                target.stage.removeListener('mouseup', this.onDragEndImpl);
                target.stage.removeListener('mouseupoutside', this.onDragEndImpl);
                target.stage.removeListener('touchend', this.onDragEndImpl);
                target.stage.removeListener('touchendoutside', this.onDragEndImpl);
                this.isBound = false;
            }
            target.insetContainer.removeListener('mousedown', this.onDragStartImpl);
            target.insetContainer.removeListener('touchstart', this.onDragStartImpl);
            this.isEnabled = false;
        };
        return DragManager;
    }(EventManager));

    /**
     * The event brokers allows you to access event managers without manually assigning
     * them to a widget. By default, the click (`PUXI.ClickManager`), dnd (`PUXI.DragManager`)
     * are defined. You can add event managers for all (new) widgets by adding an entry to
     * `EventBroker.MANAGER_MAP`.
     *
     * @memberof PUXI
     * @class
     */
    var EventBroker = /** @class */ (function () {
        function EventBroker(target) {
            this.target = target;
            var _loop_1 = function (mgr) {
                Object.defineProperty(this_1, mgr, {
                    get: function () {
                        if (!this["_" + mgr]) {
                            this["_" + mgr] = new EventBroker.MANAGER_MAP[mgr](this.target);
                        }
                        return this["_" + mgr];
                    },
                });
            };
            var this_1 = this;
            for (var _i = 0, _a = Object.keys(EventBroker.MANAGER_MAP); _i < _a.length; _i++) {
                var mgr = _a[_i];
                _loop_1(mgr);
            }
        }
        EventBroker.MANAGER_MAP = {
            click: ClickManager,
            dnd: DragManager,
        };
        return EventBroker;
    }());

    /**
     * Handles the `wheel` and `scroll` DOM events on widgets. It also registers
     * listeners for `mouseout` and `mouseover`.
     *
     * @memberof PUXI
     * @class
     * @extends PUXI.EventManager
     */
    var ScrollManager = /** @class */ (function (_super) {
        __extends(ScrollManager, _super);
        function ScrollManager(target, preventDefault) {
            if (preventDefault === void 0) { preventDefault = true; }
            var _this = _super.call(this, target) || this;
            _this.onMouseScrollImpl = function (e) {
                var _a = _this, target = _a.target, preventDefault = _a.preventDefault, delta = _a.delta;
                if (preventDefault) {
                    event.preventDefault();
                }
                if (typeof e.deltaX !== 'undefined') {
                    delta.set(e.deltaX, e.deltaY);
                }
                else // Firefox
                 {
                    delta.set(e.axis === 1 ? e.detail * 60 : 0, e.axis === 2 ? e.detail * 60 : 0);
                }
                _this.onMouseScroll.call(target, event, delta);
            };
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            _this.onHoverImpl = function (e) {
                var onMouseScrollImpl = _this.onMouseScrollImpl;
                if (!_this.bound) {
                    document.addEventListener('mousewheel', onMouseScrollImpl, false);
                    document.addEventListener('DOMMouseScroll', onMouseScrollImpl, false);
                    _this.bound = true;
                }
            };
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            _this.onMouseOutImpl = function (e) {
                var onMouseScrollImpl = _this.onMouseScrollImpl;
                if (_this.bound) {
                    document.removeEventListener('mousewheel', onMouseScrollImpl);
                    document.removeEventListener('DOMMouseScroll', onMouseScrollImpl);
                    _this.bound = false;
                }
            };
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            _this.onMouseScroll = function onMouseScroll(event, delta) {
                // Default onMouseScroll.
            };
            _this.bound = false;
            _this.delta = new PIXI$1.Point();
            _this.preventDefault = preventDefault;
            _this.startEvent();
            return _this;
        }
        /**
         * @override
         */
        ScrollManager.prototype.startEvent = function () {
            var _a = this, target = _a.target, onHoverImpl = _a.onHoverImpl, onMouseOutImpl = _a.onMouseOutImpl;
            target.contentContainer.on('mouseover', onHoverImpl);
            target.contentContainer.on('mouseout', onMouseOutImpl);
        };
        /**
         * @override
         */
        ScrollManager.prototype.stopEvent = function () {
            var _a = this, target = _a.target, onMouseScrollImpl = _a.onMouseScrollImpl, onHoverImpl = _a.onHoverImpl, onMouseOutImpl = _a.onMouseOutImpl;
            if (this.bound) {
                document.removeEventListener('mousewheel', onMouseScrollImpl);
                document.removeEventListener('DOMMouseScroll', onMouseScrollImpl);
                this.bound = false;
            }
            target.contentContainer.removeListener('mouseover', onHoverImpl);
            target.contentContainer.removeListener('mouseout', onMouseOutImpl);
        };
        return ScrollManager;
    }(EventManager));

    /**
     * A widget is a user interface control that renders content inside its prescribed
     * rectangle on the screen.
     *
     * @memberof PUXI
     * @class
     * @extends PIXI.utils.EventEmitter
     * @implements PUXI.IMeasurable
     */
    var Widget = /** @class */ (function (_super) {
        __extends(Widget, _super);
        function Widget() {
            var _this = _super.call(this) || this;
            _this.insetContainer = new PIXI$1.Container();
            _this.contentContainer = _this.insetContainer.addChild(new PIXI$1.Container());
            _this.widgetChildren = [];
            _this.stage = null;
            _this.layoutMeasure = new Insets();
            _this.initialized = false;
            _this.dragInitialized = false;
            _this.dropInitialized = false;
            _this.dirty = true;
            _this._oldWidth = -1;
            _this._oldHeight = -1;
            _this.pixelPerfect = true;
            _this._paddingLeft = 0;
            _this._paddingTop = 0;
            _this._paddingRight = 0;
            _this._paddingBottom = 0;
            _this._elevation = 0;
            _this.tint = 0;
            _this.blendMode = PIXI$1.BLEND_MODES.NORMAL;
            _this.draggable = false;
            _this.droppable = false;
            return _this;
        }
        Object.defineProperty(Widget.prototype, "measuredWidth", {
            /**
             * The measured width that is used by the parent's layout manager to place this
             * widget.
             * @member {number}
             */
            get: function () {
                return this._measuredWidth;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Widget.prototype, "measuredHeight", {
            /**
             * The measured height that is used by the parent's layout manager to place this
             * widget.
             * @member {number}
             */
            get: function () {
                return this._measuredHeight;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Alias for `Widget.measuredWidth`.
         *
         * @returns {number} the measured width
         */
        Widget.prototype.getMeasuredWidth = function () {
            return this._measuredWidth;
        };
        /**
         * Alias for `Widget.measuredHeight`.
         *
         * @returns {number} the measured height
         */
        Widget.prototype.getMeasuredHeight = function () {
            return this._measuredHeight;
        };
        /**
         * Override this method to measure the dimensions for your widget. By default, it
         * will use the natural width/height of this widget's content (`contentContainer`)
         * plus any padding.
         *
         * @param {number} width - width of region provided by parent
         * @param {number} height - height of region provided by parent
         * @param {PUXI.MeasureMode} widthMode - mode in which provided width is to be used
         * @param {PUXI.MeasureMode} heightMode - mode in which provided height is to be used
         */
        Widget.prototype.onMeasure = function (width, height, widthMode, heightMode) {
            var naturalWidth = this.contentContainer.width + this.paddingHorizontal;
            var naturalHeight = this.contentContainer.height + this.paddingVertical;
            switch (widthMode) {
                case exports.MeasureMode.EXACTLY:
                    this._measuredWidth = width;
                    break;
                case exports.MeasureMode.UNBOUNDED:
                    this._measuredWidth = naturalWidth;
                    break;
                case exports.MeasureMode.AT_MOST:
                    this._measuredWidth = Math.min(width, naturalWidth);
                    break;
            }
            switch (heightMode) {
                case exports.MeasureMode.EXACTLY:
                    this._measuredHeight = height;
                    break;
                case exports.MeasureMode.UNBOUNDED:
                    this._measuredHeight = naturalHeight;
                    break;
                case exports.MeasureMode.AT_MOST:
                    this._measuredHeight = Math.min(height, naturalHeight);
                    break;
            }
        };
        /**
         * This method calls `Widget.onMeasure` and should not be overriden. It does internal
         * bookkeeping.
         *
         * @param {number} width
         * @param {number} height
         * @param {PUXI.MeasureMode} widthMode
         * @param {PUXI.MeasureMode} heightMode
         */
        Widget.prototype.measure = function (width, height, widthMode, heightMode) {
            this.onMeasure(width, height, widthMode, heightMode);
        };
        /**
         * This method should set the frame in which rendering will occur and lay out
         * child widgets in that frame.
         *
         * @param l
         * @param t
         * @param r
         * @param b
         * @param dirty
         * @protected
         */
        Widget.prototype.layout = function (l, t, r, b, dirty) {
            if (t === void 0) { t = l; }
            if (r === void 0) { r = l; }
            if (b === void 0) { b = t; }
            this.layoutMeasure.left = l;
            this.layoutMeasure.top = t;
            this.layoutMeasure.right = r;
            this.layoutMeasure.bottom = b;
            this._width = r - l;
            this._height = b - t;
            if (this.background) {
                this.background.x = 0;
                this.background.y = 0;
                this.background.width = r - l;
                this.background.height = b - t;
            }
            // Update parallel PIXI node too!
            this.insetContainer.x = l;
            this.insetContainer.y = t;
            this.contentContainer.x = this._paddingLeft;
            this.contentContainer.y = this._paddingTop;
            // this.container.width = r - l;
            // this.container.height = b - t;
        };
        /**
         * Use this to specify how you want to layout this widget w.r.t its parent.
         * The specific layout options class depends on which layout you are
         * using in the parent widget.
         *
         * @param {PUXI.LayoutOptions} lopt
         * @returns {Widget} this
         */
        Widget.prototype.setLayoutOptions = function (lopt) {
            this.layoutOptions = lopt;
            return this;
        };
        Object.defineProperty(Widget.prototype, "eventBroker", {
            /**
             * The event broker for this widget that holds all the event managers. This can
             * be used to start/stop clicks, drags, scrolls and configure how those events
             * are handled/interpreted.
             * @member PUXI.EventBroker
             */
            get: function () {
                if (!this._eventBroker) {
                    this._eventBroker = new EventBroker(this);
                }
                return this._eventBroker;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Widget.prototype, "paddingLeft", {
            /**
             * Padding on left side.
             * @member {number}
             */
            get: function () {
                return this._paddingLeft;
            },
            set: function (val) {
                this._paddingLeft = val;
                this.dirty = true;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Widget.prototype, "paddingTop", {
            /**
             * Padding on top side.
             * @member {number}
             */
            get: function () {
                return this._paddingTop;
            },
            set: function (val) {
                this._paddingTop = val;
                this.dirty = true;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Widget.prototype, "paddingRight", {
            /**
             * Padding on right side.
             * @member {number}
             */
            get: function () {
                return this._paddingRight;
            },
            set: function (val) {
                this._paddingRight = val;
                this.dirty = true;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Widget.prototype, "paddingBottom", {
            /**
             * Padding on bottom side.
             * @member {number}
             */
            get: function () {
                return this._paddingBottom;
            },
            set: function (val) {
                this._paddingBottom = val;
                this.dirty = true;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Widget.prototype, "paddingHorizontal", {
            /**
             * Sum of left & right padding.
             * @member {number}
             * @readonly
             */
            get: function () {
                return this._paddingLeft + this._paddingRight;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Widget.prototype, "paddingVertical", {
            /**
             * Sum of top & bottom padding.
             * @member {number}
             * @readonly
             */
            get: function () {
                return this._paddingTop + this._paddingBottom;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Widget.prototype, "interactive", {
            /**
             * Whether this widget is interactive in the PixiJS scene graph.
             * @member {boolean}
             */
            get: function () {
                return this.insetContainer.interactive;
            },
            set: function (val) {
                this.insetContainer.interactive = true;
                this.contentContainer.interactive = true;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Widget.prototype, "width", {
            /**
             * Layout width of this widget.
             * @member {number}
             */
            get: function () {
                return this._width;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Widget.prototype, "height", {
            /**
             * Layout height of this widget.
             * @member {number}
             */
            get: function () {
                return this._height;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Widget.prototype, "alpha", {
            /**
             * Alpha of this widget & its contents.
             * @member {number}
             */
            get: function () {
                return this.insetContainer.alpha;
            },
            set: function (val) {
                this.insetContainer.alpha = val;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Sets the padding values.
         *
         * To set all paddings to one value:
         * ```
         * widget.setPadding(8);
         * ```
         *
         * To set horizontal & vertical padding separately:
         * ```
         * widget.setPadding(4, 12);
         * ```
         *
         * @param {number}[l=0] - left padding
         * @param {number}[t=l] - top padding (default is equal to left padding)
         * @param {number}[r=l] - right padding (default is equal to right padding)
         * @param {number}[b=t] - bottom padding (default is equal to top padding)
         */
        Widget.prototype.setPadding = function (l, t, r, b) {
            if (t === void 0) { t = l; }
            if (r === void 0) { r = l; }
            if (b === void 0) { b = t; }
            this._paddingLeft = l;
            this._paddingTop = t;
            this._paddingRight = r;
            this._paddingBottom = b;
            this.dirty = true;
            return this;
        };
        /**
         * @returns {PIXI.Container} - the background display-object
         */
        Widget.prototype.getBackground = function () {
            return this.background;
        };
        /**
         * The background of a widget is a `PIXI.DisplayObject` that is rendered before
         * all of its children.
         *
         * @param {PIXI.Container | number | string} bg - the background display-object or
         *     a color that will be used to generate a `PIXI.Graphics` as the background.
         */
        Widget.prototype.setBackground = function (bg) {
            if (this.background) {
                this.insetContainer.removeChild(this.background);
            }
            if (typeof bg === 'string') {
                bg = PIXI$1.utils.string2hex(bg);
            }
            if (typeof bg === 'number') {
                bg = new PIXI$1.Graphics()
                    .beginFill(bg)
                    .drawRect(0, 0, 1, 1)
                    .endFill();
                bg.width = this.width;
                bg.height = this.height;
            }
            this.background = bg;
            if (bg) {
                this.insetContainer.addChildAt(bg, 0);
            }
            return this;
        };
        /**
         * @returns {number} the alpha on the background display-object.
         */
        Widget.prototype.getBackgroundAlpha = function () {
            return this.background ? this.background.alpha : 1;
        };
        /**
         * This can be used to set the alpha on the _background_ of this widget. This
         * does not affect the widget's contents nor individual components of the
         * background display-object.
         *
         * @param {number} val - background alpha
         */
        Widget.prototype.setBackgroundAlpha = function (val) {
            if (!this.background) {
                this.setBackground(0xffffff);
            }
            this.background.alpha = val;
            return this;
        };
        /**
         * @return {number} the elevation set on this widget
         */
        Widget.prototype.getElevation = function () {
            return this._elevation;
        };
        /**
         * This can be used add a drop-shadow that will appear to raise this widget by
         * the given elevation against its parent.
         *
         * @param {number} val - elevation to use. 2px is good for most widgets.
         */
        Widget.prototype.setElevation = function (val) {
            this._elevation = val;
            if (val === 0 && this._dropShadow) {
                var i = this.insetContainer.filters.indexOf(this._dropShadow);
                if (i > 0) {
                    this.insetContainer.filters.splice(i, 1);
                }
            }
            else if (val > 0) {
                if (!this._dropShadow) {
                    if (!this.insetContainer.filters) {
                        this.insetContainer.filters = [];
                    }
                    this._dropShadow = new filterDropShadow.DropShadowFilter({ distance: val });
                    this.insetContainer.filters.push(this._dropShadow);
                }
                this._dropShadow.distance = val;
            }
            return this;
        };
        /**
         * Adds the widgets as children of this one.
         *
         * @param {PUXI.Widget[]} widgets
         * @returns {Widget} - this widget
         */
        Widget.prototype.addChild = function () {
            var widgets = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                widgets[_i] = arguments[_i];
            }
            for (var i = 0; i < widgets.length; i++) {
                var widget = widgets[i];
                if (widget.parent) {
                    widget.parent.removeChild(widget);
                }
                widget.parent = this;
                this.contentContainer.addChild(widget.insetContainer);
                this.widgetChildren.push(widget);
            }
            return this;
        };
        /**
         * Orphans the widgets that are children of this one.
         *
         * @param {PUXI.Widget[]} widgets
         * @returns {Widget} - this widget
         */
        Widget.prototype.removeChild = function () {
            var widgets = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                widgets[_i] = arguments[_i];
            }
            for (var i = 0; i < widgets.length; i++) {
                var widget = widgets[i];
                var index = this.widgetChildren.indexOf(widget);
                if (index !== -1) {
                    widget.insetContainer.parent.removeChild(widget.insetContainer);
                    this.widgetChildren.splice(index, 1);
                    widget.parent = null;
                }
            }
            return this;
        };
        /**
         * Makes this widget `draggable`.
         */
        Widget.prototype.makeDraggable = function () {
            this.draggable = true;
            if (this.initialized) {
                this.initDraggable();
            }
            return this;
        };
        /**
         * Makes this widget not `draggable`.
         */
        Widget.prototype.clearDraggable = function () {
            if (this.dragInitialized) {
                this.dragInitialized = false;
                this.eventBroker.dnd.stopEvent();
            }
        };
        /**
         * Widget initialization related to the stage. This method should always call
         * `super.initialize()`.
         *
         * This method expects `stage` to be set before calling it. This is handled
         * by the `Stage` itself.
         *
         * This will set `initialized` to true. If it was already set to true, it _should
         * do nothing_.
         *
         * @protected
         */
        Widget.prototype.initialize = function () {
            if (this.initialized) {
                return;
            }
            if (this.draggable) {
                this.initDraggable();
            }
            if (this.droppable) {
                this.initDroppable();
            }
            this.initialized = true;
        };
        Widget.prototype.initDraggable = function () {
            var _this = this;
            if (this.dragInitialized) {
                return;
            }
            this.dragInitialized = true;
            var realPosition = new PIXI$1.Point();
            var dragPosition = new PIXI$1.Point();
            var dnd = this.eventBroker.dnd;
            var insetContainer = this.insetContainer;
            dnd.onDragStart = function (e) {
                var added = DragDropController.add(_this, e);
                if (!_this.isDragging && added) {
                    _this.isDragging = true;
                    insetContainer.interactive = false;
                    realPosition.copyFrom(insetContainer.position);
                    _this.emit('draggablestart', e);
                }
            };
            dnd.onDragMove = function (e, offset) {
                if (_this.isDragging) {
                    dragPosition.set(realPosition.x + offset.x, realPosition.y + offset.y);
                    insetContainer.x = dragPosition.x;
                    insetContainer.y = dragPosition.y;
                    _this.emit('draggablemove', e);
                }
            };
            dnd.onDragEnd = function (e) {
                if (_this.isDragging) {
                    _this.isDragging = false;
                    DragDropController.getItem(_this);
                    // Return to container after 0ms if not picked up by a droppable
                    setTimeout(function () {
                        _this.insetContainer.interactive = true;
                        _this.insetContainer.position.copyFrom(realPosition);
                        _this.emit('draggableend', e);
                    }, 0);
                }
            };
        };
        /**
         * Makes this widget `droppable`.
         */
        Widget.prototype.makeDroppable = function () {
            this.droppable = true;
            if (this.initialized) {
                this.initDroppable();
            }
            return this;
        };
        /**
         * Makes this widget not `droppable`.
         */
        Widget.prototype.clearDroppable = function () {
            if (this.dropInitialized) {
                this.dropInitialized = false;
                this.contentContainer.removeListener('mouseup', this.onDrop);
                this.contentContainer.removeListener('touchend', this.onDrop);
            }
        };
        Widget.prototype.initDroppable = function () {
            var _this = this;
            if (!this.dropInitialized) {
                this.dropInitialized = true;
                var container = this.contentContainer;
                this.contentContainer.interactive = true;
                this.onDrop = function (event) {
                    var item = DragDropController.getEventItem(event, _this.dropGroup);
                    if (item && item.isDragging) {
                        item.isDragging = false;
                        item.insetContainer.interactive = true;
                        var parent = _this.droppableReparent !== null ? _this.droppableReparent : self;
                        parent.container.toLocal(item.container.position, item.container.parent, item);
                        if (parent.container != item.container.parent) {
                            parent.addChild(item);
                        }
                    }
                };
                container.on('mouseup', this.onDrop);
                container.on('touchend', this.onDrop);
            }
        };
        return Widget;
    }(PIXI$1.utils.EventEmitter));

    /**
     * Alignments supported by layout managers in PuxiJS core.
     *
     * @memberof PUXI
     * @enum
     */
    (function (ALIGN) {
        ALIGN[ALIGN["LEFT"] = 0] = "LEFT";
        ALIGN[ALIGN["TOP"] = 0] = "TOP";
        ALIGN[ALIGN["MIDDLE"] = 4081] = "MIDDLE";
        ALIGN[ALIGN["CENTER"] = 4081] = "CENTER";
        ALIGN[ALIGN["RIGHT"] = 1048561] = "RIGHT";
        ALIGN[ALIGN["BOTTOM"] = 1048561] = "BOTTOM";
        ALIGN[ALIGN["NONE"] = 4294967295] = "NONE";
    })(exports.ALIGN || (exports.ALIGN = {}));

    /**
     * This are the base constraints that you can apply on a `PUXI.Widget` under any
     * layout manager. It specifies the dimensions of a widget, while the position
     * of the widget is left to the parent to decide. If a dimension (width or height)
     * is set to a value between -1 and 1, then it is interpreted as a percentage
     * of the parent's dimension.
     *
     * The following example will render a widget at 50% of the parent's width and 10px height:
     *
     * ```js
     * const widget = new PUXI.Widget();
     * const parent = new PUXI.Widget();
     *
     * widget.layoutOptions = new PUXI.LayoutOptions(
     *      .5,
     *      10
     * );
     * parent.addChild(widget);
     * ```
     *
     * @memberof PUXI
     * @class
     */
    var LayoutOptions = /** @class */ (function () {
        /**
         * @param {number}[width = LayoutOptions.WRAP_CONTENT]
         * @param {number}[height = LayoutOptions.WRAP_CONTENT]
         */
        function LayoutOptions(width, height) {
            if (width === void 0) { width = LayoutOptions.WRAP_CONTENT; }
            if (height === void 0) { height = LayoutOptions.WRAP_CONTENT; }
            /**
             * Preferred width of the widget in pixels. If its value is between -1 and 1, it
             * is interpreted as a percentage of the parent's width.
             * @member {number}
             * @default {PUXI.LayoutOptions.WRAP_CONTENT}
             */
            this.width = width;
            /**
             * Preferred height of the widget in pixels. If its value is between -1 and 1, it
             * is interpreted as a percentage of the parent's height.
             * @member {number}
             * @default {PUXI.LayoutOptions.WRAP_CONTENT}
             */
            this.height = height;
            this.markers = {};
        }
        Object.defineProperty(LayoutOptions.prototype, "marginLeft", {
            /**
             * The left margin in pixels of the widget.
             * @member {number}
             * @default 0
             */
            get: function () {
                return this._marginLeft || 0;
            },
            set: function (val) {
                this._marginLeft = val;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LayoutOptions.prototype, "marginTop", {
            /**
             * This top margin in pixels of the widget.
             * @member {number}
             * @default 0
             */
            get: function () {
                return this._marginTop || 0;
            },
            set: function (val) {
                this._marginTop = val;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LayoutOptions.prototype, "marginRight", {
            /**
             * The right margin in pixels of the widget.
             * @member {number}
             * @default 0
             */
            get: function () {
                return this._marginRight || 0;
            },
            set: function (val) {
                this._marginRight = val;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LayoutOptions.prototype, "marginBottom", {
            /**
             * The bottom margin in pixels of the widget.
             * @member {number}
             * @default 0
             */
            get: function () {
                return this._marginBottom || 0;
            },
            set: function (val) {
                this._marginBottom = val;
            },
            enumerable: true,
            configurable: true
        });
        LayoutOptions.prototype.setMargin = function (left, top, right, bottom) {
            this._marginLeft = left;
            this._marginTop = top;
            this._marginRight = right;
            this._marginBottom = bottom;
        };
        LayoutOptions.FILL_PARENT = 0xfffffff1;
        LayoutOptions.WRAP_CONTENT = 0xfffffff2;
        LayoutOptions.MAX_DIMEN = 0xfffffff0;
        LayoutOptions.DEFAULT = new LayoutOptions();
        return LayoutOptions;
    }());

    /**
     * Anchored layout-options specify the left, top, right, and bottom offsets of a
     * widget in pixels. If an offset is between -1px and 1px, then it is interpreted
     * as a percentage of the parent's dimensions.
     *
     * The following example will render a widget at 80% of the parent's width and
     * 60px height.
     * ```js
     * const widget: PUXI.Widget = new Widget();
     * const anchorPane: PUXI.Widget = new Widget();
     *
     * widget.layoutOptions = new PUXI.AnchoredLayoutOptions(
     *      .10,
     *      .90,
     *      20,
     *      80
     * );
     *
     * // Prevent child from requesting natural bounds.
     * widget.layoutOptions.width = 0;
     * widget.layoutOptions.height = 0;
     * ```
     *
     * ### Intra-anchor region constraints
     *
     * If the offsets given provide a region larger than the widget's dimensions, then
     * the widget will be aligned accordingly. However, if the width or height of the
     * child is set to 0, then that child will be scaled to fit in the entire region
     * in that dimension.
     *
     * @memberof PUXI
     * @extends PUXI.LayoutOptions
     * @class
     */
    var AnchorLayoutOptions = /** @class */ (function (_super) {
        __extends(AnchorLayoutOptions, _super);
        function AnchorLayoutOptions(anchorLeft, anchorTop, anchorRight, anchorBottom, horizontalAlign, verticalAlign) {
            if (horizontalAlign === void 0) { horizontalAlign = exports.ALIGN.NONE; }
            if (verticalAlign === void 0) { verticalAlign = exports.ALIGN.NONE; }
            var _this = _super.call(this, LayoutOptions.WRAP_CONTENT, LayoutOptions.WRAP_CONTENT) || this;
            _this.anchorLeft = anchorLeft;
            _this.anchorTop = anchorTop;
            _this.anchorBottom = anchorBottom;
            _this.anchorRight = anchorRight;
            _this.horizontalAlign = horizontalAlign;
            _this.verticalAlign = verticalAlign;
            return _this;
        }
        return AnchorLayoutOptions;
    }(LayoutOptions));

    /**
     * `PUXI.FastLayoutOptions` is an extension to `PUXI.LayoutOptions` that also
     * defines the x & y coordinates. It is accepted by the stage and `PUXI.FastLayout`.
     *
     * If x or y is between -1 and 1, then that dimension will be interpreted as a
     * percentage of the parent's width or height.
     *
     * @memberof PUXI
     * @extends PUXI.LayoutOptions
     * @class
     */
    var FastLayoutOptions = /** @class */ (function (_super) {
        __extends(FastLayoutOptions, _super);
        function FastLayoutOptions(width, height, x, y, anchor) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            var _this = _super.call(this, width, height) || this;
            /**
             * X-coordinate of the widget in its parent's reference frame. If it is
             * absolutely less than 1, then it will be interpreted as a percent of
             * the parent's width.
             * @member {number}
             */
            _this.x = x;
            /**
             * Y-coordinate of the widget in its parent's reference frame. If it is
             * absolutely less than 1, then it will be interpreted as a percent of
             * the parent's height.
             * @member {number}
             */
            _this.y = y;
            /**
             * The anchor is a normalized point telling where the (x,y) position of the
             * widget lies inside of it. By default, it is (0, 0), which means that the
             * top-left corner of the widget will be at (x,y); however, setting it to
             * (.5,.5) will make the _center of the widget_ be at (x,y) in the parent's
             * reference frame.
             * @member {PIXI.Point}
             * @default PUXI.FastLayoutOptions.DEFAULT_ANCHOR
             */
            _this.anchor = anchor || FastLayoutOptions.DEFAULT_ANCHOR.clone();
            return _this;
        }
        FastLayoutOptions.DEFAULT_ANCHOR = new PIXI$1.Point(0, 0);
        FastLayoutOptions.CENTER_ANCHOR = new PIXI$1.Point(0.5, 0.5); // fragile, shouldn't be modified
        return FastLayoutOptions;
    }(LayoutOptions));

    /**
     * `PUXI.FastLayout` is used in conjunction with `PUXI.FastLayoutOptions`. It is the
     * default layout for most widget groups.
     *
     * @memberof PUXI
     * @class
     * @extends PUXI.ILayoutManager
     * @example
     * ```
     * parent.useLayout(new PUXI.FastLayout())
     * ```
     */
    var FastLayout = /** @class */ (function () {
        function FastLayout() {
        }
        FastLayout.prototype.onAttach = function (host) {
            this.host = host;
        };
        FastLayout.prototype.onDetach = function () {
            this.host = null;
        };
        FastLayout.prototype.onMeasure = function (maxWidth, maxHeight, widthMode, heightMode) {
            // TODO: Passthrough optimization pass, if there is only one child with FILL_PARENT width or height
            // then don't measure twice.
            this._measuredWidth = maxWidth;
            this._measuredHeight = maxHeight;
            var children = this.host.widgetChildren;
            // Measure children
            for (var i = 0, j = children.length; i < j; i++) {
                var widget = children[i];
                var lopt = (widget.layoutOptions || LayoutOptions.DEFAULT);
                var widthMeasureMode = this.getChildMeasureMode(lopt.width, widthMode);
                var heightMeasureMode = this.getChildMeasureMode(lopt.height, heightMode);
                var loptWidth = (Math.abs(lopt.width) < 1) ? lopt.width * maxWidth : lopt.width;
                var loptHeight = (Math.abs(lopt.height) < 1) ? lopt.height * maxHeight : lopt.height;
                widget.measure(widthMeasureMode === exports.MeasureMode.EXACTLY ? loptWidth : maxWidth, heightMeasureMode === exports.MeasureMode.EXACTLY ? loptHeight : maxHeight, widthMeasureMode, heightMeasureMode);
            }
            this._measuredWidth = this.measureWidthReach(maxWidth, widthMode);
            this._measuredHeight = this.measureHeightReach(maxHeight, heightMode);
            this.measureChildFillers();
        };
        FastLayout.prototype.getChildMeasureMode = function (dimen, parentMeasureMode) {
            if (parentMeasureMode === exports.MeasureMode.UNBOUNDED) {
                return exports.MeasureMode.UNBOUNDED;
            }
            if (dimen === LayoutOptions.FILL_PARENT || dimen === LayoutOptions.WRAP_CONTENT) {
                return exports.MeasureMode.AT_MOST;
            }
            return exports.MeasureMode.EXACTLY;
        };
        FastLayout.prototype.measureWidthReach = function (parentWidthLimit, widthMode) {
            if (widthMode === exports.MeasureMode.EXACTLY) {
                return parentWidthLimit;
            }
            var children = this.host.widgetChildren;
            var measuredWidth = 0;
            for (var i = 0, j = children.length; i < j; i++) {
                var widget = children[i];
                var childWidth = widget.getMeasuredWidth();
                var lopt = (widget.layoutOptions || LayoutOptions.DEFAULT);
                var x = lopt.x ? lopt.x : 0;
                var anchor = lopt.anchor ? lopt.anchor : FastLayoutOptions.DEFAULT_ANCHOR;
                // If lopt.x is %, then (1 - lopt.x)% of parent width should be as large
                // as (1 - anchor.x)% child's width.
                var minr = (Math.abs(x) < 1 ? (1 - anchor.x) * childWidth / (1 - x) : x);
                measuredWidth = Math.max(measuredWidth, minr);
            }
            if (widthMode === exports.MeasureMode.AT_MOST) {
                measuredWidth = Math.min(parentWidthLimit, measuredWidth);
            }
            return measuredWidth;
        };
        FastLayout.prototype.measureHeightReach = function (parentHeightLimit, heightMode) {
            if (heightMode === exports.MeasureMode.EXACTLY) {
                return parentHeightLimit;
            }
            var children = this.host.widgetChildren;
            var measuredHeight = 0;
            for (var i = 0, j = children.length; i < j; i++) {
                var widget = children[i];
                var childHeight = widget.getMeasuredHeight();
                var lopt = (widget.layoutOptions || LayoutOptions.DEFAULT);
                var y = lopt.y ? lopt.y : 0;
                var anchor = lopt.anchor ? lopt.anchor : FastLayoutOptions.DEFAULT_ANCHOR;
                var minb = (Math.abs(y) < 1 ? (1 - anchor.y) * childHeight / (1 - y) : y);
                measuredHeight = Math.max(measuredHeight, minb);
            }
            if (heightMode === exports.MeasureMode.AT_MOST) {
                measuredHeight = Math.min(parentHeightLimit, measuredHeight);
            }
            return measuredHeight;
        };
        FastLayout.prototype.measureChildFillers = function () {
            var children = this.host.widgetChildren;
            for (var i = 0, j = children.length; i < j; i++) {
                var widget = children[i];
                var lopt = (widget.layoutOptions || LayoutOptions.DEFAULT);
                if (lopt.width === LayoutOptions.FILL_PARENT || lopt.height === LayoutOptions.FILL_PARENT) {
                    var widthMode = lopt.width === LayoutOptions.FILL_PARENT ? exports.MeasureMode.EXACTLY : exports.MeasureMode.AT_MOST;
                    var heightMode = lopt.height === LayoutOptions.FILL_PARENT ? exports.MeasureMode.EXACTLY : exports.MeasureMode.AT_MOST;
                    widget.measure(this._measuredWidth, this._measuredHeight, widthMode, heightMode);
                }
            }
        };
        FastLayout.prototype.onLayout = function () {
            var parent = this.host;
            var width = parent.width, height = parent.height, children = parent.widgetChildren;
            for (var i = 0, j = children.length; i < j; i++) {
                var widget = children[i];
                var lopt = (widget.layoutOptions || LayoutOptions.DEFAULT);
                var x = lopt.x ? lopt.x : 0;
                var y = lopt.y ? lopt.y : 0;
                if (Math.abs(x) < 1) {
                    x *= width;
                }
                if (Math.abs(y) < 1) {
                    y *= height;
                }
                var anchor = lopt.anchor || FastLayoutOptions.DEFAULT_ANCHOR;
                var l = x - (anchor.x * widget.getMeasuredWidth());
                var t = y - (anchor.y * widget.getMeasuredHeight());
                widget.layout(l, t, l + widget.getMeasuredWidth(), t + widget.getMeasuredHeight());
            }
        };
        FastLayout.prototype.getMeasuredWidth = function () {
            return this._measuredWidth;
        };
        FastLayout.prototype.getMeasuredHeight = function () {
            return this._measuredHeight;
        };
        return FastLayout;
    }());

    /**
     * A widget group is a layout owner that can position its children according
     * to the layout given to it.
     *
     * @memberof PUXI
     * @class
     * @extends PUXI.Widget
     * @example
     * ```
     * const group = new PUXI.InteractiveGroup();
     *
     * group.useLayout(new PUXI.AnchorLayout());
     *
     * group.addChild(new PUXI.Button({ text: "Hey" })
     *  .setLayoutOptions(
     *      new PUXI.AnchorLayoutOptions(
     *             100,
     *             300,
     *             .4,
     *             500,
     *             PUXI.ALIGN.CENTER
     *      )
     *  )
     * )
     * ```
     */
    var WidgetGroup = /** @class */ (function (_super) {
        __extends(WidgetGroup, _super);
        function WidgetGroup() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        /**
         * Will set the given layout-manager to be used for positioning child widgets.
         *
         * @param {PUXI.ILayoutManager} layoutMgr
         */
        WidgetGroup.prototype.useLayout = function (layoutMgr) {
            if (this.layoutMgr) {
                this.layoutMgr.onDetach();
            }
            this.layoutMgr = layoutMgr;
            if (layoutMgr) {
                this.layoutMgr.onAttach(this);
            }
        };
        /**
         * Sets the widget-recommended layout manager. By default (if not overriden by widget
         * group class), this is a fast-layout.
         */
        WidgetGroup.prototype.useDefaultLayout = function () {
            this.useLayout(new FastLayout());
        };
        WidgetGroup.prototype.measure = function (width, height, widthMode, heightMode) {
            _super.prototype.measure.call(this, width, height, widthMode, heightMode);
            if (this.widgetChildren.length === 0) {
                return;
            }
            if (!this.layoutMgr) {
                this.useDefaultLayout();
            }
            this.layoutMgr.onMeasure(width, height, widthMode, heightMode);
            this._measuredWidth = Math.max(this.measuredWidth, this.layoutMgr.getMeasuredWidth());
            this._measuredHeight = Math.max(this.measuredHeight, this.layoutMgr.getMeasuredHeight());
        };
        WidgetGroup.prototype.layout = function (l, t, r, b, dirty) {
            if (dirty === void 0) { dirty = true; }
            _super.prototype.layout.call(this, l, t, r, b, dirty);
            if (this.widgetChildren.length === 0) {
                return;
            }
            if (!this.layoutMgr) {
                this.useDefaultLayout();
            }
            this.layoutMgr.onLayout(); // layoutMgr is attached to this
        };
        return WidgetGroup;
    }(Widget));

    /**
     * An interactive container.
     *
     * @class
     * @extends PUXI.WidgetGroup
     * @memberof PUXI
     */
    var InteractiveGroup = /** @class */ (function (_super) {
        __extends(InteractiveGroup, _super);
        function InteractiveGroup() {
            var _this = _super.call(this) || this;
            _this.hitArea = new PIXI$1.Rectangle();
            _this.insetContainer.hitArea = _this.hitArea;
            return _this;
        }
        InteractiveGroup.prototype.update = function () {
            // YO
        };
        InteractiveGroup.prototype.layout = function (l, t, r, b, dirty) {
            _super.prototype.layout.call(this, l, t, r, b, dirty);
            this.hitArea.width = this.width;
            this.hitArea.height = this.height;
        };
        return InteractiveGroup;
    }(WidgetGroup));

    /**
     * Represents a view that can gain or loose focus. It is primarily subclassed by
     * input/form widgets.
     *
     * Generally, it is a good idea not use layouts on these types of widgets.
     *
     * @class
     * @extends PUXI.Widget
     * @memberof PUXI
     */
    var FocusableWidget = /** @class */ (function (_super) {
        __extends(FocusableWidget, _super);
        /**
         * @param {PUXI.IInputBaseOptions} options
         * @param {PIXI.Container}[options.background]
         * @param {number}[options.tabIndex]
         * @param {any}[options.tabGroup]
         */
        function FocusableWidget(options) {
            if (options === void 0) { options = {}; }
            var _this = _super.call(this) || this;
            _this.bindEvents = function () {
                _this.stage.on('pointerdown', _this.onDocumentPointerDownImpl);
                document.addEventListener('keydown', _this.onKeyDownImpl);
            };
            _this.clearEvents = function () {
                _this.stage.off('pointerdown', _this.onDocumentPointerDownImpl);
                document.removeEventListener('keydown', _this.onKeyDownImpl);
            };
            _this.onKeyDownImpl = function (e) {
                var focusCtl = _this.stage.focusController;
                if (e.which === 9 && focusCtl.useTab) {
                    focusCtl.onTab();
                    e.preventDefault();
                }
                else if (e.which === 38 && focusCtl.useBack) {
                    focusCtl.onBack();
                    e.preventDefault();
                }
                else if (e.which === 40 && focusCtl.useForward) {
                    focusCtl.onForward();
                    e.preventDefault();
                }
                _this.emit('keydown');
            };
            _this.onDocumentPointerDownImpl = function () {
                if (!_this._isMousePressed) {
                    _this.blur();
                }
            };
            if (options.background) {
                _super.prototype.setBackground.call(_this, options.background);
            }
            // Prevents double focusing/blurring.
            _this._isFocused = false;
            // Used to lose focus when mouse-down outside widget.
            _this._isMousePressed = false;
            _this.interactive = true;
            /**
             * @member {number}
             * @readonly
             */
            _this.tabIndex = options.tabIndex;
            /**
             * The name of the tab group in which this widget's focus will move on
             * pressing tab.
             * @member {PUXI.TabGroup}
             * @readonly
             */
            _this.tabGroup = options.tabGroup;
            _this.insetContainer.on('pointerdown', function () {
                _this.focus();
                _this._isMousePressed = true;
            });
            _this.insetContainer.on('pointerup', function () { _this._isMousePressed = false; });
            _this.insetContainer.on('pointerupoutside', function () { _this._isMousePressed = false; });
            return _this;
        }
        /**
         * Brings this widget into focus.
         */
        FocusableWidget.prototype.focus = function () {
            if (this.isFocused) {
                return;
            }
            this.stage.focusController.notifyFocus(this);
            this._isFocused = true;
            this.bindEvents();
            this.emit('focusChanged', true);
            this.emit('focus');
        };
        /**
         * Brings this widget out of focus.
         */
        FocusableWidget.prototype.blur = function () {
            if (!this._isFocused) {
                return;
            }
            this.stage.focusController.notifyBlur();
            this._isFocused = false;
            this.clearEvents();
            this.emit('focusChanged', false);
            this.emit('blur');
        };
        Object.defineProperty(FocusableWidget.prototype, "isFocused", {
            /**
             * Whether this widget is in focus.
             * @member {boolean}
             * @readonly
             */
            get: function () {
                return this._isFocused;
            },
            enumerable: true,
            configurable: true
        });
        FocusableWidget.prototype.initialize = function () {
            _super.prototype.initialize.call(this);
            this.stage.focusController.in(this, this.tabIndex, this.tabGroup);
        };
        return FocusableWidget;
    }(InteractiveGroup));

    /**
     * A static text widget. It cannot retain children.
     *
     * @memberof PUXI
     * @class
     * @extends PUXI.Widget
     */
    var TextWidget = /** @class */ (function (_super) {
        __extends(TextWidget, _super);
        /**
         * @param {string} text - text content
         * @param {PIXI.TextStyle} textStyle - styled used for text
         */
        function TextWidget(text, textStyle) {
            var _this = _super.call(this) || this;
            _this.textDisplay = new PIXI$1.Text(text, textStyle);
            _this.contentContainer.addChild(_this.textDisplay);
            return _this;
        }
        TextWidget.prototype.update = function () {
            if (this.tint !== null) {
                this.textDisplay.tint = this.tint;
            }
            if (this.blendMode !== null) {
                this.textDisplay.blendMode = this.blendMode;
            }
        };
        Object.defineProperty(TextWidget.prototype, "value", {
            get: function () {
                return this.textDisplay.text;
            },
            set: function (val) {
                this.textDisplay.text = val;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextWidget.prototype, "text", {
            get: function () {
                return this.value;
            },
            set: function (val) {
                this.value = val;
            },
            enumerable: true,
            configurable: true
        });
        return TextWidget;
    }(Widget));

    /**
     * Button that can be clicked.
     *
     * @memberof PUXI
     * @class
     * @extends PUXI.FocusableWidget
     */
    var Button = /** @class */ (function (_super) {
        __extends(Button, _super);
        /**
         * @param [options.background}] {(PIXI.UI.SliceSprite|PIXI.UI.Sprite)} will be used as background for Button
         * @param [options.text=null] {PIXI.UI.Text} optional text
         * @param [options.tabIndex=0] {Number} input tab index
         * @param [options.tabGroup=0] {Number|String} input tab group
         * @param [options.width=options.background.width] {Number|String} width
         * @param [options.height=options.background.height] {Number|String} height
         */
        function Button(options) {
            var _this = _super.call(this, options) || this;
            _this.isHover = false;
            if (typeof options.text === 'string') {
                options.text = new TextWidget(options.text, new PIXI$1.TextStyle());
            }
            _this.textWidget = options.text.setLayoutOptions(new FastLayoutOptions(LayoutOptions.WRAP_CONTENT, LayoutOptions.WRAP_CONTENT, 0.5, 0.5, FastLayoutOptions.CENTER_ANCHOR));
            if (_this.textWidget) {
                _this.addChild(_this.textWidget);
            }
            _this.contentContainer.buttonMode = true;
            _this.setupClick();
            return _this;
        }
        Button.prototype.setupClick = function () {
            var _this = this;
            var clickEvent = this.eventBroker.click;
            clickEvent.onHover = function (e, over) {
                _this.isHover = over;
                _this.emit('hover', over);
            };
            clickEvent.onPress = function (e, isPressed) {
                if (isPressed) {
                    _this.focus();
                    e.data.originalEvent.preventDefault();
                }
                _this.emit('press', isPressed);
            };
            clickEvent.onClick = function (e) {
                _this.click();
            };
            this.click = function () {
                _this.emit('click');
            };
        };
        Button.prototype.update = function () {
            // No update needed
        };
        Button.prototype.initialize = function () {
            _super.prototype.initialize.call(this);
            this.setupClick();
            this.insetContainer.interactiveChildren = false;
            // lazy to make sure all children is initialized (trying to get the bedst hitArea possible)
        };
        Object.defineProperty(Button.prototype, "value", {
            /**
             * Label for this button.
             * @member {string}
             */
            get: function () {
                if (this.textWidget) {
                    return this.textWidget.text;
                }
                return '';
            },
            set: function (val) {
                if (this.textWidget) {
                    this.textWidget.text = val;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Button.prototype, "text", {
            get: function () {
                return this.textWidget;
            },
            set: function (val) {
                this.value = val;
            },
            enumerable: true,
            configurable: true
        });
        return Button;
    }(FocusableWidget));
    /*
     * Features:
     * Button, radio button (checkgroups)
     *
     * Methods:
     * blur()
     * focus()
     *
     * Properties:
     * checked: get/set Button checked
     * value: get/set Button value
     *
     * Events:
     * "hover"          param: [bool]isHover (hover/leave)
     * "press"          param: [bool]isPressed (pointerdown/pointerup)
     * "click"
     * "blur"
     * "focus"
     * "focusChanged"   param: [bool]isFocussed
     *
     */

    /**
     * @memberof PUXI
     * @extends PUXI.IFocusableOptions
     * @member {boolean} checked
     * @member {PIXI.Container}[checkmark]
     * @member {PUXI.CheckGroup}[checkGroup]
     * @member {string}[value]
     */
    /**
     * A checkbox is a button can be selected (checked). It has a on/off state that
     * can be controlled by the user.
     *
     * When used in a checkbox group, the group will control whether the checkbox can
     * be selected or not.
     *
     * @memberof PUXI
     * @class
     * @extends PUXI.FocusableWidget
     */
    var CheckBox = /** @class */ (function (_super) {
        __extends(CheckBox, _super);
        /**
         * @param {PUXI.ICheckBoxOptions} options
         * @param [options.checked=false] {bool} is checked
         * @param options.background {(PIXI.UI.SliceSprite|PIXI.UI.Sprite)} will be used as background for CheckBox
         * @param options.checkmark {(PIXI.UI.SliceSprite|PIXI.UI.Sprite)} will be used as checkmark for CheckBox
         * @param {PUXI.CheckGroup}[options.checkGroup=null] CheckGroup name
         * @param options.value {String} mostly used along with checkgroup
         * @param [options.tabIndex=0] {Number} input tab index
         * @param [options.tabGroup=0] {Number|String} input tab group
         */
        function CheckBox(options) {
            var _this = _super.call(this, options) || this;
            _this.change = function (val) {
                if (_this.checkmark) {
                    _this.checkmark.alpha = val ? 1 : 0;
                }
            };
            _this.click = function () {
                _this.emit('click');
                if (_this.checkGroup !== null && _this.checked) {
                    return;
                }
                _this.checked = !_this.checked;
                _this.emit('changed', _this.checked);
            };
            _this._checked = options.checked !== undefined ? options.checked : false;
            _this._value = options.value || '';
            _this.checkGroup = options.checkGroup || null;
            _this.checkmark = new InteractiveGroup();
            _this.checkmark.contentContainer.addChild(options.checkmark);
            _this.checkmark.setLayoutOptions(new FastLayoutOptions(LayoutOptions.WRAP_CONTENT, LayoutOptions.WRAP_CONTENT, 0.5, 0.5, FastLayoutOptions.CENTER_ANCHOR));
            _this.checkmark.alpha = _this._checked ? 1 : 0;
            _this.addChild(_this.checkmark);
            _this.contentContainer.buttonMode = true;
            return _this;
        }
        CheckBox.prototype.update = function () {
            // No need for updating
        };
        Object.defineProperty(CheckBox.prototype, "checked", {
            get: function () {
                return this._checked;
            },
            set: function (val) {
                if (val !== this._checked) {
                    if (this.checkGroup !== null && val) {
                        this.stage.checkBoxGroupController.notifyCheck(this);
                    }
                    this._checked = val;
                    this.change(val);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CheckBox.prototype, "value", {
            get: function () {
                return this._value;
            },
            set: function (val) {
                this._value = val;
                if (this.checked) {
                    this.stage.checkBoxGroupController.notifyCheck(this);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CheckBox.prototype, "selectedValue", {
            get: function () {
                var _a;
                return (_a = this.stage) === null || _a === void 0 ? void 0 : _a.checkBoxGroupController.getSelected(this.checkGroup).value;
            },
            enumerable: true,
            configurable: true
        });
        CheckBox.prototype.initialize = function () {
            var _this = this;
            _super.prototype.initialize.call(this);
            var clickMgr = this.eventBroker.click;
            clickMgr.onHover = function (_, over) {
                _this.emit('hover', over);
            };
            clickMgr.onPress = function (e, isPressed) {
                if (isPressed) {
                    _this.focus();
                    e.data.originalEvent.preventDefault();
                }
                _this.emit('press', isPressed);
            };
            clickMgr.onClick = function () {
                _this.click();
            };
            if (this.checkGroup !== null) {
                this.stage.checkBoxGroupController.in(this, this.checkGroup);
            }
        };
        return CheckBox;
    }(FocusableWidget));
    /*
     * Features:
     * checkbox, radio button (checkgroups)
     *
     * Methods:
     * blur()
     * focus()
     * change(checked) //only exposed to overwrite (if you dont want to hard toggle alpha of checkmark)
     *
     * Properties:
     * checked: get/set checkbox checked
     * value: get/set checkbox value
     * selectedValue: get/set selected value for checkgroup
     *
     * Events:
     * "hover"          param: [bool]isHover (hover/leave)
     * "press"          param: [bool]isPressed (pointerdown/pointerup)
     * "click"
     * "blur"
     * "focus"
     * "focusChanged"   param: [bool]isFocussed
     * "change"         param: [bool]isChecked
     *
     */

    function DynamicTextStyle(parent)
    {
        this.respectDirty = true;
        this._parent = parent || null;
        this._scale = 1;
        this._align = 'left';
        this._fontFamily = 'Arial';
        this._fontSize = 26;
        this._fontWeight = 'normal';
        this._fontStyle = 'normal';
        this._letterSpacing = 0;
        this._lineHeight = 0;
        this._verticalAlign = 0;
        this._rotation = 0;
        this._skew = 0;
        this._tint = '#FFFFFF';
        this._fill = '#FFFFFF';
        this._shadow = '';
        this._stroke = 0;
        this._strokeFill = '';
        this._strokeShadow = '';
        this._wrap = true;
        this._breakWords = false;
        this._overflowX = 'visible'; // visible|hidden
        this._overflowY = 'visible'; // visible|hidden
        this._ellipsis = false;

        let _cachedEllipsisSize = null;

        this.ellipsisSize = function (atlas)
        {
            if (!this.ellipsis) return 0;
            if (_cachedEllipsisSize === null)
            { _cachedEllipsisSize = (atlas.getCharObject('.', this).width + this.letterSpacing) * 3; }

            return _cachedEllipsisSize;
        };
    }

    DynamicTextStyle.prototype.clone = function ()
    {
        const style = new DynamicTextStyle();

        style.merge(this);

        return style;
    };

    DynamicTextStyle.prototype.merge = function (style)
    {
        if (typeof style === 'object')
        {
            this.respectDirty = false;
            for (const param in style)
            {
                const val = style[param];

                if (typeof val === 'function' || param === 'respectDirty' || param === '_parent') continue;
                this[param] = style[param];
            }
            this.respectDirty = true;
            this._dirty = true;
        }
    };

    DynamicTextStyle.prototype.ctxKey = function (char)
    {
        return [char, this.fill, this.shadow, this.stroke, this.strokeFill, this.strokeShadow].join('|');
    };

    DynamicTextStyle.prototype.ctxFont = function ()
    {
        const fontSize = `${Math.min(200, Math.max(1, this.fontSize || 26))}px `;
        const fontWeight = this.fontWeight === 'bold' ? `${this.fontWeight} ` : '';
        const fontStyle = this.fontStyle === 'italic' || this.fontStyle === 'oblique' ? `${this.fontStyle} ` : '';

        return fontWeight + fontStyle + fontSize + this.fontFamily;
    };

    DynamicTextStyle.prototype.constructor = DynamicTextStyle;

    Object.defineProperties(DynamicTextStyle.prototype, {
        _dirty: {
            set(val)
            {
                if (this.respectDirty)
                {
                    if (this._parent !== null)
                    {
                        this._parent.dirtyStyle = val;
                        this._parent.update();
                    }
                }
            },
        },
        scale: {
            get()
            {
                return this._scale;
            },
            set(val)
            {
                if (val !== this._scale)
                {
                    this._scale = val;
                    this._dirty = true;
                }
            },
        },
        align: {
            get()
            {
                return this._align;
            },
            set(val)
            {
                if (val !== this._align)
                {
                    this._align = val;
                    this._dirty = true;
                }
            },
        },
        fontFamily: {
            get()
            {
                return this._fontFamily;
            },
            set(val)
            {
                if (val !== this._fontFamily)
                {
                    this._fontFamily = val;
                    this._dirty = true;
                }
            },
        },
        fontSize: {
            get()
            {
                return this._fontSize;
            },
            set(val)
            {
                if (val !== this._fontSize)
                {
                    this._fontSize = val;
                    this._dirty = true;
                }
            },
        },
        fontWeight: {
            get()
            {
                return this._fontWeight;
            },
            set(val)
            {
                if (val !== this._fontWeight)
                {
                    this._fontWeight = val;
                    this._dirty = true;
                }
            },
        },
        fontStyle: {
            get()
            {
                return this._fontStyle;
            },
            set(val)
            {
                if (val !== this._fontStyle)
                {
                    this._fontStyle = val;
                    this._dirty = true;
                }
            },
        },
        letterSpacing: {
            get()
            {
                return this._letterSpacing;
            },
            set(val)
            {
                if (val !== this._letterSpacing)
                {
                    this._letterSpacing = val;
                    this._dirty = true;
                }
            },
        },
        lineHeight: {
            get()
            {
                return this._lineHeight;
            },
            set(val)
            {
                if (val !== this._lineHeight)
                {
                    this._lineHeight = val;
                    this._dirty = true;
                }
            },
        },
        verticalAlign: {
            get()
            {
                return this._verticalAlign;
            },
            set(val)
            {
                if (val !== this._verticalAlign)
                {
                    this._verticalAlign = val;
                    this._dirty = true;
                }
            },
        },
        rotation: {
            get()
            {
                return this._rotation;
            },
            set(val)
            {
                if (val !== this._rotation)
                {
                    this._rotation = val;
                    this._dirty = true;
                }
            },
        },
        skew: {
            get()
            {
                return this._skew;
            },
            set(val)
            {
                if (val !== this._skew)
                {
                    this._skew = val;
                    this._dirty = true;
                }
            },
        },
        tint: {
            get()
            {
                return this._tint;
            },
            set(val)
            {
                if (val !== this._tint)
                {
                    this._tint = val;
                    this._dirty = true;
                }
            },
        },
        fill: {
            get()
            {
                return this._fill;
            },
            set(val)
            {
                if (val !== this._fill)
                {
                    this._fill = val;
                    this._dirty = true;
                }
            },
        },
        shadow: {
            get()
            {
                return this._shadow;
            },
            set(val)
            {
                if (val !== this._shadow)
                {
                    this._shadow = val;
                    this._dirty = true;
                }
            },
        },
        stroke: {
            get()
            {
                return this._stroke;
            },
            set(val)
            {
                if (val !== this._stroke)
                {
                    this._stroke = val;
                    this._dirty = true;
                }
            },
        },
        strokeFill: {
            get()
            {
                return this._strokeFill;
            },
            set(val)
            {
                if (val !== this._strokeFill)
                {
                    this._strokeFill = val;
                    this._dirty = true;
                }
            },
        },
        strokeShadow: {
            get()
            {
                return this._strokeShadow;
            },
            set(val)
            {
                if (val !== this._strokeShadow)
                {
                    this._strokeShadow = val;
                    this._dirty = true;
                }
            },
        },
        wrap: {
            get()
            {
                return this._wrap;
            },
            set(val)
            {
                if (val !== this._wrap)
                {
                    this._wrap = val;
                    this._dirty = true;
                }
            },
        },
        breakWords: {
            get()
            {
                return this._breakWords;
            },
            set(val)
            {
                if (val !== this._breakWords)
                {
                    this._breakWords = val;
                    this._dirty = true;
                }
            },
        },
        overflowX: {
            get()
            {
                return this._overflowX;
            },
            set(val)
            {
                if (val !== this._overflowX)
                {
                    this._overflowX = val;
                    this._dirty = true;
                }
            },
        },
        overflowY: {
            get()
            {
                return this._overflowY;
            },
            set(val)
            {
                if (val !== this._overflowY)
                {
                    this._overflowY = val;
                    this._dirty = true;
                }
            },
        },
        ellipsis: {
            get()
            {
                return this._ellipsis;
            },
            set(val)
            {
                if (val !== this._ellipsis)
                {
                    this._ellipsis = val;
                    this._dirty = true;
                }
            },
        },
    });

    function DynamicChar()
    {
        // styledata (texture, orig width, orig height)
        this.style = null;

        // char data
        this.data = null;

        // is this char space?
        this.space = false;

        // is this char newline?
        this.newline = false;

        this.emoji = false;

        // charcode
        this.charcode = 0;

        // char string value
        this.value = '';

        // word index
        this.wordIndex = -1;

        // line index of char
        this.lineIndex = -1;
    }

    DynamicChar.prototype.constructor = DynamicChar;

    var emojiRegex = function () {
      // https://mths.be/emoji
      return /\uD83C\uDFF4\uDB40\uDC67\uDB40\uDC62(?:\uDB40\uDC65\uDB40\uDC6E\uDB40\uDC67|\uDB40\uDC73\uDB40\uDC63\uDB40\uDC74|\uDB40\uDC77\uDB40\uDC6C\uDB40\uDC73)\uDB40\uDC7F|\uD83D\uDC68(?:\uD83C\uDFFC\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68\uD83C\uDFFB|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFF\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFE])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFE\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFD])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFD\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB\uDFFC])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D)?\uD83D\uDC68|(?:\uD83D[\uDC68\uDC69])\u200D(?:\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67]))|\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|(?:\uD83D[\uDC68\uDC69])\u200D(?:\uD83D[\uDC66\uDC67])|[\u2695\u2696\u2708]\uFE0F|\uD83D[\uDC66\uDC67]|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|(?:\uD83C\uDFFB\u200D[\u2695\u2696\u2708]|\uD83C\uDFFF\u200D[\u2695\u2696\u2708]|\uD83C\uDFFE\u200D[\u2695\u2696\u2708]|\uD83C\uDFFD\u200D[\u2695\u2696\u2708]|\uD83C\uDFFC\u200D[\u2695\u2696\u2708])\uFE0F|\uD83C\uDFFB\u200D(?:\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C[\uDFFB-\uDFFF])|(?:\uD83E\uDDD1\uD83C\uDFFB\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFC\u200D\uD83E\uDD1D\u200D\uD83D\uDC69)\uD83C\uDFFB|\uD83E\uDDD1(?:\uD83C\uDFFF\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1(?:\uD83C[\uDFFB-\uDFFF])|\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1)|(?:\uD83E\uDDD1\uD83C\uDFFE\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFF\u200D\uD83E\uDD1D\u200D(?:\uD83D[\uDC68\uDC69]))(?:\uD83C[\uDFFB-\uDFFE])|(?:\uD83E\uDDD1\uD83C\uDFFC\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFD\u200D\uD83E\uDD1D\u200D\uD83D\uDC69)(?:\uD83C[\uDFFB\uDFFC])|\uD83D\uDC69(?:\uD83C\uDFFE\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFD\uDFFF])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFC\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB\uDFFD-\uDFFF])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFB\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFC-\uDFFF])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFD\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D(?:\uD83D[\uDC68\uDC69])|\uD83D[\uDC68\uDC69])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFF\u200D(?:\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD]))|\uD83D\uDC69\u200D\uD83D\uDC69\u200D(?:\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67]))|(?:\uD83E\uDDD1\uD83C\uDFFD\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFE\u200D\uD83E\uDD1D\u200D\uD83D\uDC69)(?:\uD83C[\uDFFB-\uDFFD])|\uD83D\uDC69\u200D\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC69\u200D\uD83D\uDC69\u200D(?:\uD83D[\uDC66\uDC67])|(?:\uD83D\uDC41\uFE0F\u200D\uD83D\uDDE8|\uD83D\uDC69(?:\uD83C\uDFFF\u200D[\u2695\u2696\u2708]|\uD83C\uDFFE\u200D[\u2695\u2696\u2708]|\uD83C\uDFFC\u200D[\u2695\u2696\u2708]|\uD83C\uDFFB\u200D[\u2695\u2696\u2708]|\uD83C\uDFFD\u200D[\u2695\u2696\u2708]|\u200D[\u2695\u2696\u2708])|(?:(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)\uFE0F|\uD83D\uDC6F|\uD83E[\uDD3C\uDDDE\uDDDF])\u200D[\u2640\u2642]|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2640\u2642]|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDCD-\uDDCF\uDDD6-\uDDDD])(?:(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2640\u2642]|\u200D[\u2640\u2642])|\uD83C\uDFF4\u200D\u2620)\uFE0F|\uD83D\uDC69\u200D\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|\uD83C\uDFF3\uFE0F\u200D\uD83C\uDF08|\uD83D\uDC15\u200D\uD83E\uDDBA|\uD83D\uDC69\u200D\uD83D\uDC66|\uD83D\uDC69\u200D\uD83D\uDC67|\uD83C\uDDFD\uD83C\uDDF0|\uD83C\uDDF4\uD83C\uDDF2|\uD83C\uDDF6\uD83C\uDDE6|[#\*0-9]\uFE0F\u20E3|\uD83C\uDDE7(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEF\uDDF1-\uDDF4\uDDF6-\uDDF9\uDDFB\uDDFC\uDDFE\uDDFF])|\uD83C\uDDF9(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDED\uDDEF-\uDDF4\uDDF7\uDDF9\uDDFB\uDDFC\uDDFF])|\uD83C\uDDEA(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDED\uDDF7-\uDDFA])|\uD83E\uDDD1(?:\uD83C[\uDFFB-\uDFFF])|\uD83C\uDDF7(?:\uD83C[\uDDEA\uDDF4\uDDF8\uDDFA\uDDFC])|\uD83D\uDC69(?:\uD83C[\uDFFB-\uDFFF])|\uD83C\uDDF2(?:\uD83C[\uDDE6\uDDE8-\uDDED\uDDF0-\uDDFF])|\uD83C\uDDE6(?:\uD83C[\uDDE8-\uDDEC\uDDEE\uDDF1\uDDF2\uDDF4\uDDF6-\uDDFA\uDDFC\uDDFD\uDDFF])|\uD83C\uDDF0(?:\uD83C[\uDDEA\uDDEC-\uDDEE\uDDF2\uDDF3\uDDF5\uDDF7\uDDFC\uDDFE\uDDFF])|\uD83C\uDDED(?:\uD83C[\uDDF0\uDDF2\uDDF3\uDDF7\uDDF9\uDDFA])|\uD83C\uDDE9(?:\uD83C[\uDDEA\uDDEC\uDDEF\uDDF0\uDDF2\uDDF4\uDDFF])|\uD83C\uDDFE(?:\uD83C[\uDDEA\uDDF9])|\uD83C\uDDEC(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEE\uDDF1-\uDDF3\uDDF5-\uDDFA\uDDFC\uDDFE])|\uD83C\uDDF8(?:\uD83C[\uDDE6-\uDDEA\uDDEC-\uDDF4\uDDF7-\uDDF9\uDDFB\uDDFD-\uDDFF])|\uD83C\uDDEB(?:\uD83C[\uDDEE-\uDDF0\uDDF2\uDDF4\uDDF7])|\uD83C\uDDF5(?:\uD83C[\uDDE6\uDDEA-\uDDED\uDDF0-\uDDF3\uDDF7-\uDDF9\uDDFC\uDDFE])|\uD83C\uDDFB(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDEE\uDDF3\uDDFA])|\uD83C\uDDF3(?:\uD83C[\uDDE6\uDDE8\uDDEA-\uDDEC\uDDEE\uDDF1\uDDF4\uDDF5\uDDF7\uDDFA\uDDFF])|\uD83C\uDDE8(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDEE\uDDF0-\uDDF5\uDDF7\uDDFA-\uDDFF])|\uD83C\uDDF1(?:\uD83C[\uDDE6-\uDDE8\uDDEE\uDDF0\uDDF7-\uDDFB\uDDFE])|\uD83C\uDDFF(?:\uD83C[\uDDE6\uDDF2\uDDFC])|\uD83C\uDDFC(?:\uD83C[\uDDEB\uDDF8])|\uD83C\uDDFA(?:\uD83C[\uDDE6\uDDEC\uDDF2\uDDF3\uDDF8\uDDFE\uDDFF])|\uD83C\uDDEE(?:\uD83C[\uDDE8-\uDDEA\uDDF1-\uDDF4\uDDF6-\uDDF9])|\uD83C\uDDEF(?:\uD83C[\uDDEA\uDDF2\uDDF4\uDDF5])|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDCD-\uDDCF\uDDD6-\uDDDD])(?:\uD83C[\uDFFB-\uDFFF])|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uD83C[\uDFFB-\uDFFF])|(?:[\u261D\u270A-\u270D]|\uD83C[\uDF85\uDFC2\uDFC7]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66\uDC67\uDC6B-\uDC6D\uDC70\uDC72\uDC74-\uDC76\uDC78\uDC7C\uDC83\uDC85\uDCAA\uDD74\uDD7A\uDD90\uDD95\uDD96\uDE4C\uDE4F\uDEC0\uDECC]|\uD83E[\uDD0F\uDD18-\uDD1C\uDD1E\uDD1F\uDD30-\uDD36\uDDB5\uDDB6\uDDBB\uDDD2-\uDDD5])(?:\uD83C[\uDFFB-\uDFFF])|(?:[\u231A\u231B\u23E9-\u23EC\u23F0\u23F3\u25FD\u25FE\u2614\u2615\u2648-\u2653\u267F\u2693\u26A1\u26AA\u26AB\u26BD\u26BE\u26C4\u26C5\u26CE\u26D4\u26EA\u26F2\u26F3\u26F5\u26FA\u26FD\u2705\u270A\u270B\u2728\u274C\u274E\u2753-\u2755\u2757\u2795-\u2797\u27B0\u27BF\u2B1B\u2B1C\u2B50\u2B55]|\uD83C[\uDC04\uDCCF\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE1A\uDE2F\uDE32-\uDE36\uDE38-\uDE3A\uDE50\uDE51\uDF00-\uDF20\uDF2D-\uDF35\uDF37-\uDF7C\uDF7E-\uDF93\uDFA0-\uDFCA\uDFCF-\uDFD3\uDFE0-\uDFF0\uDFF4\uDFF8-\uDFFF]|\uD83D[\uDC00-\uDC3E\uDC40\uDC42-\uDCFC\uDCFF-\uDD3D\uDD4B-\uDD4E\uDD50-\uDD67\uDD7A\uDD95\uDD96\uDDA4\uDDFB-\uDE4F\uDE80-\uDEC5\uDECC\uDED0-\uDED2\uDED5\uDEEB\uDEEC\uDEF4-\uDEFA\uDFE0-\uDFEB]|\uD83E[\uDD0D-\uDD3A\uDD3C-\uDD45\uDD47-\uDD71\uDD73-\uDD76\uDD7A-\uDDA2\uDDA5-\uDDAA\uDDAE-\uDDCA\uDDCD-\uDDFF\uDE70-\uDE73\uDE78-\uDE7A\uDE80-\uDE82\uDE90-\uDE95])|(?:[#\*0-9\xA9\xAE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9\u21AA\u231A\u231B\u2328\u23CF\u23E9-\u23F3\u23F8-\u23FA\u24C2\u25AA\u25AB\u25B6\u25C0\u25FB-\u25FE\u2600-\u2604\u260E\u2611\u2614\u2615\u2618\u261D\u2620\u2622\u2623\u2626\u262A\u262E\u262F\u2638-\u263A\u2640\u2642\u2648-\u2653\u265F\u2660\u2663\u2665\u2666\u2668\u267B\u267E\u267F\u2692-\u2697\u2699\u269B\u269C\u26A0\u26A1\u26AA\u26AB\u26B0\u26B1\u26BD\u26BE\u26C4\u26C5\u26C8\u26CE\u26CF\u26D1\u26D3\u26D4\u26E9\u26EA\u26F0-\u26F5\u26F7-\u26FA\u26FD\u2702\u2705\u2708-\u270D\u270F\u2712\u2714\u2716\u271D\u2721\u2728\u2733\u2734\u2744\u2747\u274C\u274E\u2753-\u2755\u2757\u2763\u2764\u2795-\u2797\u27A1\u27B0\u27BF\u2934\u2935\u2B05-\u2B07\u2B1B\u2B1C\u2B50\u2B55\u3030\u303D\u3297\u3299]|\uD83C[\uDC04\uDCCF\uDD70\uDD71\uDD7E\uDD7F\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE02\uDE1A\uDE2F\uDE32-\uDE3A\uDE50\uDE51\uDF00-\uDF21\uDF24-\uDF93\uDF96\uDF97\uDF99-\uDF9B\uDF9E-\uDFF0\uDFF3-\uDFF5\uDFF7-\uDFFF]|\uD83D[\uDC00-\uDCFD\uDCFF-\uDD3D\uDD49-\uDD4E\uDD50-\uDD67\uDD6F\uDD70\uDD73-\uDD7A\uDD87\uDD8A-\uDD8D\uDD90\uDD95\uDD96\uDDA4\uDDA5\uDDA8\uDDB1\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA-\uDE4F\uDE80-\uDEC5\uDECB-\uDED2\uDED5\uDEE0-\uDEE5\uDEE9\uDEEB\uDEEC\uDEF0\uDEF3-\uDEFA\uDFE0-\uDFEB]|\uD83E[\uDD0D-\uDD3A\uDD3C-\uDD45\uDD47-\uDD71\uDD73-\uDD76\uDD7A-\uDDA2\uDDA5-\uDDAA\uDDAE-\uDDCA\uDDCD-\uDDFF\uDE70-\uDE73\uDE78-\uDE7A\uDE80-\uDE82\uDE90-\uDE95])\uFE0F|(?:[\u261D\u26F9\u270A-\u270D]|\uD83C[\uDF85\uDFC2-\uDFC4\uDFC7\uDFCA-\uDFCC]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66-\uDC78\uDC7C\uDC81-\uDC83\uDC85-\uDC87\uDC8F\uDC91\uDCAA\uDD74\uDD75\uDD7A\uDD90\uDD95\uDD96\uDE45-\uDE47\uDE4B-\uDE4F\uDEA3\uDEB4-\uDEB6\uDEC0\uDECC]|\uD83E[\uDD0F\uDD18-\uDD1F\uDD26\uDD30-\uDD39\uDD3C-\uDD3E\uDDB5\uDDB6\uDDB8\uDDB9\uDDBB\uDDCD-\uDDCF\uDDD1-\uDDDD])/g;
    };

    let atlas = null;

    /**
    * An dynamic text object with auto generated atlas
    *
    * @class
    * @extends PIXI.UI.UIBase
    * @memberof PIXI.UI
    * @param text {String} Text content
    * @param [width=0] {Number|String} width of textbox. 0 = autoWidth
    * @param [height=0] {Number|String} height of textbox. 0 = autoHeight
    * @param [allowTags=true] {boolean} Allow inline styling
    * @param [options=null] {DynamicTextStyle} Additional text settings
    */
    function DynamicText(text, options)
    {
        options = options || {};

        Widget.call(this, options.width || 0, options.height || 0);

        // create atlas
        if (atlas === null)
        { atlas = new DynamicAtlas(1); }

        const autoWidth = !options.width;
        const autoHeight = !options.height;

        // defaultstyle for this textobject
        const defaultStyle = this._style = new DynamicTextStyle(this);

        defaultStyle.merge(options.style);

        // collection of all processed char
        const chars = this.chars = [];
        const renderChars = [];
        const spriteCache = []; // (temp)
        const charContainer = new PIXI.Container();

        this.container.addChild(charContainer);

        // the input text
        this._inputText = text;

        // states
        let lastWidth = 0;
        let lastHeight = 0;

        this.dirtyText = true;
        this.dirtyStyle = true;
        this.dirtyRender = true;

        // dictionary for line data
        const lineWidthData = [];
        const lineHeightData = [];
        const lineFontSizeData = [];
        const lineAlignmentData = [];
        let renderCount = 0;
        let charCount = 0;

        // ellipsis caches (not nessesary when no sprites)
        const lineEllipsisData = [];
        const lineHasEllipsis = [];

        // ROUGH TEMP RENDER (with sprites)
        this.render = function ()
        {
            let yOffset = 0;
            let xOffset = 0;
            let currentLine = -1;
            let i;

            if (spriteCache.length > renderCount)
            {
                for (i = renderCount; i < spriteCache.length; i++)
                {
                    const removeSprite = spriteCache[i];

                    if (removeSprite)
                    { removeSprite.visible = false; }
                }
            }

            let char; let lineWidth = 0; let lineHeight = 0; let
                maxLineWidth = 0;

            for (i = 0; i < renderCount; i++)
            {
                char = renderChars[i];

                // get line data
                if (currentLine !== char.lineIndex)
                {
                    currentLine = char.lineIndex;
                    lineWidth = lineWidthData[currentLine];
                    lineHeight = lineHeightData[currentLine];
                    yOffset += lineHeight;

                    switch (lineAlignmentData[currentLine])
                    {
                        case 'right': xOffset = this._width - lineWidth; break;
                        case 'center': xOffset = (this._width - lineWidth) * 0.5; break;
                        default: xOffset = 0;
                    }

                    maxLineWidth = Math.max(lineWidth, maxLineWidth);
                }

                // no reason to render a blank space or 0x0 letters (no texture created)
                if (!char.data.texture || char.space || char.newline)
                {
                    if (spriteCache[i])
                    { spriteCache[i].visible = false; }
                    continue;
                }

                // add new sprite
                const tex = char.data.texture; let
                    sprite = spriteCache[i];

                if (!sprite)
                {
                    sprite = spriteCache[i] = new PIXI.Sprite(tex);
                    sprite.anchor.set(0.5);
                }
                else
                { sprite.texture = tex; }

                sprite.visible = true;
                sprite.x = char.x + xOffset + tex.width * 0.5;
                sprite.y = char.y + yOffset - tex.height * 0.5 - (lineHeight - lineFontSizeData[currentLine]);

                sprite.tint = char.emoji ? 0xffffff : hexToInt(char.style.tint, 0xffffff);
                sprite.rotation = float(char.style.rotation, 0);
                sprite.skew.x = float(char.style.skew, 0);

                if (!sprite.parent)
                { charContainer.addChild(sprite); }
            }

            if (autoWidth) this.width = maxLineWidth;
            if (autoHeight) this.height = yOffset;
        };

        // updates the renderChar array and position chars for render
        this.prepareForRender = function ()
        {
            const pos = new PIXI.Point();
            let wordIndex = 0;
            let lineHeight = 0;
            let lineFontSize = 0;
            let lineIndex = 0;
            let lineAlignment = defaultStyle.align;
            let lastSpaceIndex = -1;
            let lastSpaceLineWidth = 0;
            let textHeight = 0;
            let forceNewline = false;
            let style;
            let renderIndex = 0;
            let ellipsis = false;
            let lineFull = false;
            let i;

            for (i = 0; i < charCount; i++)
            {
                const char = chars[i]; const
                    lastChar = chars[i - 1];

                style = char.style;

                // lineheight
                lineHeight = Math.max(lineHeight, defaultStyle.lineHeight || style.lineHeight || char.data.lineHeight);

                if (style.overflowY !== 'visible' && lineHeight + textHeight > this._height)
                {
                    if (style.overflowY === 'hidden')
                    { break; }
                }

                if (char.newline)
                { lineFull = false; }

                // set word index
                if (char.space || char.newline) wordIndex++;
                else char.wordIndex = wordIndex;

                // textheight
                lineFontSize = Math.max(lineFontSize, style.fontSize);

                // lineindex
                char.lineIndex = lineIndex;

                // lineAlignment
                if (style.align !== defaultStyle.align) lineAlignment = style.align;

                if (char.space)
                {
                    lastSpaceIndex = i;
                    lastSpaceLineWidth = pos.x;
                }

                const size = Math.round(char.data.width) + float(style.letterSpacing, 0);

                if (!autoWidth && !forceNewline && !char.newline && pos.x + size > this._width)
                {
                    if (style.wrap)
                    {
                        if (char.space)
                        {
                            forceNewline = true;
                        }
                        else if (lastSpaceIndex !== -1)
                        {
                            renderIndex -= i - lastSpaceIndex;
                            i = lastSpaceIndex - 1;
                            lastSpaceIndex = -1;
                            pos.x = lastSpaceLineWidth;
                            forceNewline = true;
                            continue;
                        }
                        else if (style.breakWords)
                        {
                            if (lastChar)
                            {
                                pos.x -= lastChar.style.letterSpacing;
                                pos.x -= lastChar.data.width;
                            }
                            i -= 2;
                            renderIndex--;
                            forceNewline = true;
                            continue;
                        }
                    }

                    if (style.overflowX == 'hidden' && !forceNewline)
                    {
                        lineFull = true;
                        if (style.ellipsis && !ellipsis)
                        {
                            ellipsis = true;
                            let ellipsisData = lineEllipsisData[lineIndex];

                            if (!ellipsisData) ellipsisData = lineEllipsisData[lineIndex] = [new DynamicChar(), new DynamicChar(), new DynamicChar()];
                            for (let d = 0; d < 3; d++)
                            {
                                const dot = ellipsisData[d];

                                dot.value = '.';
                                dot.data = atlas.getCharObject(dot.value, style);
                                dot.style = style;
                                dot.x = pos.x + char.data.xOffset;
                                dot.y = parseFloat(style.verticalAlign) + dot.data.yOffset;
                                dot.lineIndex = lineIndex;
                                pos.x += Math.round(dot.data.width) + float(style.letterSpacing, 0);
                                renderChars[renderIndex] = dot;
                                renderIndex++;
                            }
                        }
                    }
                }

                // Update position and add to renderchars
                if (!lineFull)
                {
                    // position
                    char.x = pos.x + char.data.xOffset;
                    char.y = parseFloat(style.verticalAlign) + char.data.yOffset;
                    pos.x += size;
                    renderChars[renderIndex] = char;
                    renderIndex++;
                }

                // new line
                if (forceNewline || char.newline || i === charCount - 1)
                {
                    if (lastChar)
                    {
                        pos.x -= lastChar.style.letterSpacing;
                    }

                    if (char.space)
                    {
                        pos.x -= char.data.width;
                        pos.x -= float(style.letterSpacing, 0);
                    }

                    textHeight += lineHeight;
                    lineHasEllipsis[lineIndex] = ellipsis;
                    lineWidthData[lineIndex] = pos.x;
                    lineHeightData[lineIndex] = lineHeight;
                    lineFontSizeData[lineIndex] = lineFontSize;
                    lineAlignmentData[lineIndex] = lineAlignment;

                    // reset line vaules
                    lineHeight = pos.x = lastSpaceLineWidth = lineFontSize = 0;
                    lineAlignment = defaultStyle.align;
                    lastSpaceIndex = -1;
                    lineIndex++;
                    forceNewline = lineFull = ellipsis = false;
                }
            }

            renderCount = renderIndex;
        };

        // phrases the input text and prepares the char array
        const closeTags = ['</i>', '</b>', '</font>', '</center>'];

        this.processInputText = function ()
        {
            const styleTree = [defaultStyle];
            let charIndex = 0;
            let inputTextIndex = 0;
            const inputArray = Array.from(this._inputText);

            for (let i = 0; i < inputArray.length; i++)
            {
                style = styleTree[styleTree.length - 1];
                let c = inputArray[i];
                const charcode = c.charCodeAt(0);
                let newline = false;
                let space = false;
                let emoji = false;

                // Extract Tags
                if ((/(?:\r\n|\r|\n)/).test(c))
                { newline = true; }
                else if ((/(\s)/).test(c))
                { space = true; }
                else if (options.allowTags && c === '<')
                {
                    let tag = this._inputText.substring(inputTextIndex);

                    tag = tag.slice(0, tag.indexOf('>') + 1);
                    let FoundTag = true;

                    if (tag.length)
                    {
                        if (tag === '<i>')
                        {
                            style = style.clone();
                            style.fontStyle = 'italic';
                            styleTree.push(style);
                        }
                        else if (tag === '<b>')
                        {
                            style = style.clone();
                            style.fontWeight = 'bold';
                            styleTree.push(style);
                        }
                        else if (tag === '<center>')
                        {
                            style = style.clone();
                            style.align = 'center';
                            styleTree.push(style);
                        }
                        else if (closeTags.indexOf(tag) !== -1)
                        {
                            if (styleTree.length > 1) styleTree.splice(styleTree.length - 1, 1);
                        }
                        else if (tag.startsWith('<font '))
                        {
                            const regex = /(\w+)\s*=\s*((["'])(.*?)\3|([^>\s]*)(?=\s|\/>))(?=[^<]*>)/g;
                            let match = regex.exec(tag);

                            if (match !== null)
                            {
                                style = style.clone();
                                while (match !== null)
                                {
                                    switch (match[1])
                                    {
                                        case 'family': match[1] = 'fontFamily'; break;
                                        case 'size': match[1] = 'fontSize'; break;
                                        case 'weight': match[1] = 'fontWeight'; break;
                                        case 'style': match[1] = 'fontStyle'; break;
                                        case 'valign': match[1] = 'verticalAlign'; break;
                                        case 'spacing': match[1] = 'letterSpacing'; break;
                                        case 'color': match[1] = 'tint'; break;
                                    }
                                    style[match[1]] = match[4];
                                    match = regex.exec(tag);
                                }
                                styleTree.push(style);
                            }
                        }
                        else
                        {
                            FoundTag = false;
                        }

                        if (FoundTag)
                        {
                            inputTextIndex += tag.length;
                            i += tag.length - 1;
                            continue;
                        }
                    }
                }
                else
                {
                    // detect emoji
                    let emojiMatch = emojiRegex().exec(c);

                    if (emojiMatch !== null)
                    {
                        i--; c = '';
                        while (emojiMatch !== null && c !== emojiMatch[0])
                        {
                            i++;
                            c = emojiMatch[0];
                            emojiMatch = emojiRegex().exec(c + inputArray[i + 1]);
                        }
                        emoji = true;
                    }
                }

                // Prepare DynamicChar object
                let char = chars[charIndex];

                if (!char)
                {
                    char = new DynamicChar();
                    chars[charIndex] = char;
                }
                char.style = style;

                if (emoji)
                {
                    char.style = char.style.clone();
                    char.style.fontFamily = DynamicText.settings.defaultEmojiFont;
                }

                char.data = atlas.getCharObject(c, char.style);
                char.value = c;
                char.space = space;
                char.newline = newline;
                char.emoji = emoji;

                charIndex++;
                inputTextIndex += c.length;
            }
            charCount = charIndex;
        };

        // PIXIUI update, lazy update (bad solution needs rewrite when converted to pixi plugin)
        this.lazyUpdate = null;
        const self = this;

        this.update = function ()
        {
            if (self.lazyUpdate !== null) return;
            self.lazyUpdate = setTimeout(function ()
            {
                // console.log("UPDATING TEXT");
                const dirtySize = !autoWidth && (self._width != lastWidth || self._height != lastHeight || self.dirtyText);

                if (self.dirtyText || self.dirtyStyle)
                {
                    self.dirtyText = self.dirtyStyle = false;
                    self.dirtyRender = true; // force render after textchange
                    self.processInputText();
                }

                if (dirtySize || self.dirtyRender)
                {
                    self.dirtyRender = false;
                    lastWidth = self._width;
                    lastHeight = self.height;
                    self.prepareForRender();
                    self.render();
                }
                self.lazyUpdate = null;
            }, 0);
        };
    }

    DynamicText.prototype = Object.create(Widget.prototype);
    DynamicText.prototype.constructor = DynamicText;

    DynamicText.settings = {
        debugSpriteSheet: false,
        defaultEmojiFont: 'Segoe UI Emoji', // force one font family for emojis so we dont rerender them multiple times
    };

    Object.defineProperties(DynamicText.prototype, {
        value: {
            get()
            {
                return this._inputText;
            },
            set(val)
            {
                if (val !== this._inputText)
                {
                    this._inputText = val;
                    this.dirtyText = true;
                    this.update();
                    // console.log("Updating Text to: " + val);
                }
            },
        },
        text: {
            get()
            {
                return this.value;
            },
            set(val)
            {
                this.value = val;
            },
        },
        style: {
            get()
            {
                return this._style;
            },
            set(val)
            {
                // get a clean default style
                const style = new DynamicTextStyle(this);

                // merge it with new style
                style.merge(val);

                // merge it onto this default style
                this._style.merge(style);

                this.dirtyStyle = true;
                this.update();
            },
        },
    });

    // Atlas
    const metricsCanvas = document.createElement('canvas');
    const metricsContext = metricsCanvas.getContext('2d');

    metricsCanvas.width = 100;
    metricsCanvas.height = 100;

    var DynamicAtlas = function (padding)
    {
        let canvas;
        let context;
        let objects;
        let newObjects = [];
        let baseTexture;
        let lazyTimeout;
        let rootNode;
        let atlasdim;
        const startdim = 256;
        const maxdim = 2048;

        var AtlasNode = function (w, h)
        {
            const children = this.children = [];

            this.rect = new PIXI.Rectangle(0, 0, w || 0, h || 0);
            this.data = null;

            this.insert = function (width, height, obj)
            {
                if (children.length > 0)
                {
                    const newNode = children[0].insert(width, height, obj);

                    if (newNode !== null) return newNode;

                    return children[1].insert(width, height, obj);
                }
                if (this.data !== null) return null;
                if (width > this.rect.width || height > this.rect.height) return null;
                if (width == this.rect.width && height == this.rect.height)
                {
                    this.data = obj;
                    obj.frame.x = this.rect.x;
                    obj.frame.y = this.rect.y;

                    return this;
                }

                children.push(new AtlasNode());
                children.push(new AtlasNode());

                const dw = this.rect.width - width;
                const dh = this.rect.height - height;

                if (dw > dh)
                {
                    children[0].rect = new PIXI.Rectangle(this.rect.x, this.rect.y, width, this.rect.height);
                    children[1].rect = new PIXI.Rectangle(this.rect.x + width, this.rect.y, this.rect.width - width, this.rect.height);
                }
                else
                {
                    children[0].rect = new PIXI.Rectangle(this.rect.x, this.rect.y, this.rect.width, height);
                    children[1].rect = new PIXI.Rectangle(this.rect.x, this.rect.y + height, this.rect.width, this.rect.height - height);
                }

                return children[0].insert(width, height, obj);
            };
        };

        const addCanvas = function ()
        {
            // create new canvas
            canvas = document.createElement('canvas');
            context = canvas.getContext('2d');

            // reset dimentions
            atlasdim = startdim;
            canvas.width = canvas.height = atlasdim;
            rootNode = new AtlasNode(atlasdim, atlasdim);

            // reset array with canvas objects and create new atlas
            objects = [];

            // set new basetexture
            baseTexture = PIXI.BaseTexture.fromCanvas(canvas);
            baseTexture.mipmap = false; // if not, pixi bug resizing POW2
            baseTexture.resolution = 1; // todo: support all resolutions
            baseTexture.update();

            // Debug Spritesheet
            if (DynamicText.settings.debugSpriteSheet)
            {
                canvas.className = 'DynamicText_SpriteSheet';
                document.body.appendChild(canvas);
            }
        };

        this.fontFamilyCache = {};

        const drawObjects = function (arr, resized)
        {
            if (resized) baseTexture.update();
            for (let i = 0; i < arr.length; i++)
            { drawObject(arr[i]); }
        };

        var drawObject = function (obj)
        {
            context.drawImage(obj._cache, obj.frame.x, obj.frame.y);
            obj.texture.frame = obj.frame;
            obj.texture.update();
        };

        this.getCharObject = function (char, style)
        {
            const font = style.ctxFont();

            // create new cache for fontFamily
            let familyCache = this.fontFamilyCache[font];

            if (!familyCache)
            {
                familyCache = {};
                this.fontFamilyCache[font] = familyCache;
            }

            // get char data
            const key = style.ctxKey(char);
            let obj = familyCache[key];

            if (!obj)
            {
                // create char object
                const metrics = generateCharData(char, style);

                // temp resize if doesnt fit (not nesseary when we dont need to generate textures)
                if (metrics.rect)
                {
                    if (canvas.width < metrics.rect.width || canvas.height < metrics.rect.height)
                    {
                        canvas.width = canvas.height = Math.max(metrics.rect.width, metrics.rect.height);
                        baseTexture.update();
                    }
                }

                // todo: cleanup when we know whats needed
                obj = {
                    metrics,
                    font,
                    value: char,
                    frame: metrics.rect,
                    baseTexture: metrics.rect ? baseTexture : null,
                    xOffset: metrics.bounds ? metrics.bounds.minx : 0,
                    yOffset: metrics.descent || 0,
                    width: metrics.width || 0,
                    lineHeight: metrics.lineHeight || 0,
                    _cache: metrics.canvas,
                    texture: metrics.rect ? new PIXI.Texture(baseTexture, metrics.rect) : null, // temp texture
                };

                // add to collections
                familyCache[key] = obj;

                // add to atlas if visible char
                if (metrics.rect)
                {
                    newObjects.push(obj);

                    if (lazyTimeout === undefined)
                    {
                        lazyTimeout = setTimeout(function ()
                        {
                            addNewObjects();
                            lazyTimeout = undefined;
                        }, 0);
                    }
                }
            }

            return obj;
        };

        const compareFunction = function (a, b)
        {
            if (a.frame.height < b.frame.height)
            { return 1; }

            if (a.frame.height > b.frame.height)
            { return -1; }

            if (a.frame.width < b.frame.width)
            { return 1; }

            if (a.frame.width > b.frame.width)
            { return -1; }

            return 0;
        };

        var addNewObjects = function ()
        {
            newObjects.sort(compareFunction);
            let _resized = false;
            let _newcanvas = false;

            for (let i = 0; i < newObjects.length; i++)
            {
                const obj = newObjects[i];
                const node = rootNode.insert(obj.frame.width + padding, obj.frame.height + padding, obj);

                if (node !== null)
                {
                    if (_newcanvas) obj.texture.baseTexture = baseTexture; // update basetexture if new canvas was created (temp)
                    objects.push(obj);
                    continue;
                }

                // step one back (so it will be added after resize/new canvas)
                i--;

                if (atlasdim < maxdim)
                {
                    _resized = true;
                    resizeCanvas(atlasdim * 2);
                    continue;
                }

                // close current spritesheet and make a new one
                drawObjects(objects, _resized);
                addCanvas();
                _newcanvas = true;
                _resized = false;
            }

            drawObjects(_resized || _newcanvas ? objects : newObjects, _resized);
            newObjects = [];
        };

        var resizeCanvas = function (dim)
        {
            canvas.width = canvas.height = atlasdim = dim;

            rootNode = new AtlasNode(dim, dim);
            objects.sort(compareFunction);

            for (let i = 0; i < objects.length; i++)
            {
                const obj = objects[i];

                rootNode.insert(obj.frame.width + padding, obj.frame.height + padding, obj);
            }
        };

        var generateCharData = function (char, style)
        {
            const fontSize = Math.max(1, int(style.fontSize, 26));
            const lineHeight = fontSize * 1.25;

            // Start our returnobject
            const data = {
                fontSize,
                lineHeight,
                width: 0,
            };

            // Return if newline
            if (!char || (/(?:\r\n|\r|\n)/).test(char))
            { return data; }

            // Ctx font string
            const font = style.ctxFont();

            metricsContext.font = font;

            // Get char width
            data.width = Math.round(metricsContext.measureText(char).width);

            // Return if char = space
            if ((/(\s)/).test(char)) return data;

            // set canvas size (with padding so we can messure)
            const paddingY = Math.round(fontSize * 0.7); const
                paddingX = Math.max(5, Math.round(fontSize * 0.7));

            metricsCanvas.width = Math.ceil(data.width) + paddingX * 2;
            metricsCanvas.height = 1.5 * fontSize;
            const w = metricsCanvas.width; const h = metricsCanvas.height; const
                baseline = (h / 2) + (paddingY * 0.5);

            // set font again after resize
            metricsContext.font = font;

            // make sure canvas is clean
            metricsContext.clearRect(0, 0, w, h);

            // save clean state with font
            metricsContext.save();

            // convert shadow string to shadow data
            const shadowData = function (str)
            {
                const data = str.trim().split(' ');

                return {
                    color: string(data[0], '#000000'),
                    alpha: float(data[1], 0.5),
                    xOffset: float(data[2], 3),
                    yOffset: float(data[3], 3),
                    blur: float(data[4], 5),
                };
            };

            // convert fill string to fill data
            const fillData = function (str)
            {
                const data = str.trim().split(' ');
                const c = string(data[0], '#FFFFFF');
                const a = float(data[1], 1);

                return {
                    color: c,
                    alpha: a,
                    position: float(data[2], -1),
                    rgba: hexToRgba(c, a),
                };
            };

            // create fill style from fill string
            const getFillStyle = function (str)
            {
                const fills = str.split(',').filter(function (s) { return s !== ''; }); let
                    i;

                // convert to fill data
                for (i = 0; i < fills.length; i++) fills[i] = fillData(fills[i]);

                switch (fills.length)
                {
                    case 0: return 'white';
                    case 1: return fills[0].rgba ? fills[0].rgba : fills[0].color || '#FFFFFF';
                    default:
                        // make gradient
                        try
                        {
                            const gradEnd = baseline + lineHeight - fontSize;
                            const gradient = metricsContext.createLinearGradient(0, gradEnd - fontSize, 0, gradEnd);

                            for (i = 0; i < fills.length; i++)
                            { gradient.addColorStop(fills[i].position !== -1 ? fills[i].position : i / (fills.length - 1), fills[i].rgba || fills[i].color); }

                            return gradient;
                        }
                        catch (e)
                        {
                            return '#FFFFFF';
                        }
                }
            };

            // function to draw shadows
            const drawShadows = function (shadowString, stroke)
            {
                const shadows = shadowString.trim().split(',').filter(function (s) { return s !== ''; });

                if (shadows.length)
                {
                    for (let i = 0; i < shadows.length; i++)
                    {
                        const s = shadowData(shadows[i]);

                        metricsContext.globalAlpha = s.alpha;
                        metricsContext.shadowColor = s.color;
                        metricsContext.shadowOffsetX = s.xOffset + w;
                        metricsContext.shadowOffsetY = s.yOffset;
                        metricsContext.shadowBlur = s.blur;

                        if (stroke)
                        {
                            metricsContext.lineWidth = style.stroke;
                            metricsContext.strokeText(char, paddingX - w, baseline);
                        }
                        else metricsContext.fillText(char, paddingX - w, baseline);
                    }
                    metricsContext.restore();
                }
            };

            // draw text shadows
            if (style.shadow.length)
            { drawShadows(style.shadow, false); }

            // draw stroke shadows
            if (style.stroke && style.strokeShadow.length)
            {
                drawShadows(style.strokeShadow, true);
            }

            // draw text
            metricsContext.fillStyle = getFillStyle(string(style.fill, '#000000'));
            metricsContext.fillText(char, paddingX, baseline);
            metricsContext.restore();

            // draw stroke
            if (style.stroke)
            {
                metricsContext.strokeStyle = getFillStyle(string(style.strokeFill, '#000000'));
                metricsContext.lineWidth = style.stroke;
                metricsContext.strokeText(char, paddingX, baseline);
                metricsContext.restore();
            }

            // begin messuring
            const pixelData = metricsContext.getImageData(0, 0, w, h).data;

            let i = 3;
            const line = w * 4;
            const len = pixelData.length;

            // scanline on alpha
            while (i < len && !pixelData[i]) { i += 4; }
            const ascent = (i / line) | 0;

            if (i < len)
            {
                // rev scanline on alpha
                i = len - 1;
                while (i > 0 && !pixelData[i]) { i -= 4; }
                const descent = (i / line) | 0;

                // left to right scanline on alpha
                for (i = 3; i < len && !pixelData[i];)
                {
                    i += line;
                    if (i >= len) { i = (i - len) + 4; }
                }
                const minx = ((i % line) / 4) | 0;

                // right to left scanline on alpha
                let step = 1;

                for (i = len - 1; i >= 0 && !pixelData[i];)
                {
                    i -= line;
                    if (i < 0) { i = (len - 1) - (step++) * 4; }
                }
                const maxx = ((i % line) / 4) + 1 | 0;

                // set font metrics
                data.ascent = Math.round(baseline - ascent);
                data.descent = Math.round(descent - baseline);
                data.height = 1 + Math.round(descent - ascent);
                data.bounds = {
                    minx: minx - paddingX,
                    maxx: maxx - paddingX,
                    miny: 0,
                    maxy: descent - ascent,
                };
                data.rect = {
                    x: data.bounds.minx,
                    y: -data.ascent - 2,
                    width: data.bounds.maxx - data.bounds.minx + 2,
                    height: data.ascent + data.descent + 4,
                };

                // cache (for fast rearrange later)
                data.canvas = document.createElement('canvas');
                data.canvas.width = data.rect.width;
                data.canvas.height = data.rect.height;
                const c = data.canvas.getContext('2d');

                c.drawImage(metricsCanvas, -paddingX - data.rect.x, -baseline - data.rect.y);

                // reset rect position
                data.rect.x = data.rect.y = 0;
            }

            return data;
        };

        addCanvas();
    };

    // helper function for float or default
    function float(val, def)
    {
        if (isNaN(val)) return def;

        return parseFloat(val);
    }

    // helper function for int or default
    function int(val, def)
    {
        if (isNaN(val)) return def;

        return parseInt(val);
    }

    // helper function for string or default
    function string(val, def)
    {
        if (typeof val === 'string' && val.length) return val;

        return def;
    }

    // helper function to convert string hex to int or default
    function hexToInt(str, def)
    {
        if (typeof str === 'number')
        { return str; }

        const result = parseInt(str.replace('#', '0x'));

        if (isNaN(result)) return def;

        return result;
    }

    // helper function to convert hex to rgba
    function hexToRgba(hex, alpha)
    {
        const result = (/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i).exec(hex);

        alpha = float(alpha, 1);

        return result ? `rgba(${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)},${alpha})` : false;
    }

    function EaseBase()
    {
        this.getPosition = function (p)
        {
            return p;
        };
    }

    EaseBase.prototype.constructor = EaseBase;

    function ExponentialEase(power, easeIn, easeOut)
    {
        const pow = power;
        const t = easeIn && easeOut ? 3 : easeOut ? 1 : 2;

        this.getPosition = function (p)
        {
            let r = (t === 1) ? 1 - p : (t === 2) ? p : (p < 0.5) ? p * 2 : (1 - p) * 2;

            if (pow === 1)
            {
                r *= r;
            }
            else if (pow === 2)
            {
                r *= r * r;
            }
            else if (pow === 3)
            {
                r *= r * r * r;
            }
            else if (pow === 4)
            {
                r *= r * r * r * r;
            }

            return (t === 1) ? 1 - r : (t === 2) ? r : (p < 0.5) ? r / 2 : 1 - (r / 2);
        };
    }

    ExponentialEase.prototype = Object.create(EaseBase.prototype);
    ExponentialEase.prototype.constructor = ExponentialEase;

    const Ease = {};

    const HALF_PI = Math.PI * 0.5;

    function create(fn)
    {
        const e = Object.create(EaseBase.prototype);

        e.getPosition = fn;

        return e;
    }

    // Liear
    Ease.Linear = new EaseBase();

    // Exponetial Eases
    function wrapEase(easeInFunction, easeOutFunction, easeInOutFunction)
    {
        return {
            easeIn: easeInFunction,
            easeOut: easeOutFunction,
            easeInOut: easeInOutFunction,
        };
    }

    Ease.Power0 = {
        easeNone: Ease.Linear,
    };

    Ease.Power1 = Ease.Quad = wrapEase(
        new ExponentialEase(1, 1, 0),
        new ExponentialEase(1, 0, 1),
        new ExponentialEase(1, 1, 1));

    Ease.Power2 = Ease.Cubic = wrapEase(
        new ExponentialEase(2, 1, 0),
        new ExponentialEase(2, 0, 1),
        new ExponentialEase(2, 1, 1));

    Ease.Power3 = Ease.Quart = wrapEase(
        new ExponentialEase(3, 1, 0),
        new ExponentialEase(3, 0, 1),
        new ExponentialEase(3, 1, 1));

    Ease.Power4 = Ease.Quint = wrapEase(
        new ExponentialEase(4, 1, 0),
        new ExponentialEase(4, 0, 1),
        new ExponentialEase(4, 1, 1));

    // Bounce
    Ease.Bounce = {
        BounceIn: create(function (p)
        {
            if ((p = 1 - p) < 1 / 2.75)
            {
                return 1 - (7.5625 * p * p);
            }
            else if (p < 2 / 2.75)
            {
                return 1 - (7.5625 * (p -= 1.5 / 2.75) * p + 0.75);
            }
            else if (p < 2.5 / 2.75)
            {
                return 1 - (7.5625 * (p -= 2.25 / 2.75) * p + 0.9375);
            }

            return 1 - (7.5625 * (p -= 2.625 / 2.75) * p + 0.984375);
        }),
        BounceOut: create(function (p)
        {
            if (p < 1 / 2.75)
            {
                return 7.5625 * p * p;
            }
            else if (p < 2 / 2.75)
            {
                return 7.5625 * (p -= 1.5 / 2.75) * p + 0.75;
            }
            else if (p < 2.5 / 2.75)
            {
                return 7.5625 * (p -= 2.25 / 2.75) * p + 0.9375;
            }

            return 7.5625 * (p -= 2.625 / 2.75) * p + 0.984375;
        }),
        BounceInOut: create(function (p)
        {
            const invert = (p < 0.5);

            if (invert)
            {
                p = 1 - (p * 2);
            }
            else
            {
                p = (p * 2) - 1;
            }
            if (p < 1 / 2.75)
            {
                p = 7.5625 * p * p;
            }
            else if (p < 2 / 2.75)
            {
                p = 7.5625 * (p -= 1.5 / 2.75) * p + 0.75;
            }
            else if (p < 2.5 / 2.75)
            {
                p = 7.5625 * (p -= 2.25 / 2.75) * p + 0.9375;
            }
            else
            {
                p = 7.5625 * (p -= 2.625 / 2.75) * p + 0.984375;
            }

            return invert ? (1 - p) * 0.5 : p * 0.5 + 0.5;
        }),
    };

    // Circ
    Ease.Circ = {
        CircIn: create(function (p)
        {
            return -(Math.sqrt(1 - (p * p)) - 1);
        }),
        CircOut: create(function (p)
        {
            return Math.sqrt(1 - (p = p - 1) * p);
        }),
        CircInOut: create(function (p)
        {
            return ((p *= 2) < 1) ? -0.5 * (Math.sqrt(1 - p * p) - 1) : 0.5 * (Math.sqrt(1 - (p -= 2) * p) + 1);
        }),
    };

    // Expo
    Ease.Expo = {
        ExpoIn: create(function (p)
        {
            return Math.pow(2, 10 * (p - 1)) - 0.001;
        }),
        ExpoOut: create(function (p)
        {
            return 1 - Math.pow(2, -10 * p);
        }),
        ExpoInOut: create(function (p)
        {
            return ((p *= 2) < 1) ? 0.5 * Math.pow(2, 10 * (p - 1)) : 0.5 * (2 - Math.pow(2, -10 * (p - 1)));
        }),
    };

    // Sine
    Ease.Sine = {
        SineIn: create(function (p)
        {
            return -Math.cos(p * HALF_PI) + 1;
        }),
        SineOut: create(function (p)
        {
            return Math.sin(p * HALF_PI);
        }),
        SineInOut: create(function (p)
        {
            return -0.5 * (Math.cos(Math.PI * p) - 1);
        }),
    };

    var Helpers = {
        Lerp: function (start, stop, amt) {
            if (amt > 1)
                amt = 1;
            else if (amt < 0)
                amt = 0;
            return start + (stop - start) * amt;
        },
        Round: function (number, decimals) {
            var pow = Math.pow(10, decimals);
            return Math.round(number * pow) / pow;
        },
        componentToHex: function (c) {
            var hex = c.toString(16);
            return hex.length == 1 ? "0" + hex : hex;
        },
        rgbToHex: function (r, g, b) {
            return "#" + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);
        },
        rgbToNumber: function (r, g, b) {
            return r * 65536 + g * 256 + b;
        },
        numberToRgb: function (c) {
            return {
                r: Math.floor(c / (256 * 256)),
                g: Math.floor(c / 256) % 256,
                b: c % 256,
            };
        },
        hexToRgb: function (hex) {
            if (hex === null) {
                hex = 0xffffff;
            }
            if (!isNaN(hex)) {
                return this.numberToRgb(hex);
            }
            // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
            var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
            hex = hex.replace(shorthandRegex, function (m, r, g, b) {
                return r + r + g + g + b + b;
            });
            var result = (/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i).exec(hex);
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16),
            } : null;
        },
    };

    var _tweenItemCache = [];
    var _callbackItemCache = [];
    var _tweenObjects = {};
    var _activeTweenObjects = {};
    var _currentId = 1;
    var TweenObject = /** @class */ (function () {
        function TweenObject(object) {
            this.object = object;
            this.tweens = {};
            this.active = false;
            this.onUpdate = null;
        }
        return TweenObject;
    }());
    var CallbackItem = /** @class */ (function () {
        function CallbackItem() {
            this._ready = false;
            this.obj = null;
            this.parent = null;
            this.key = '';
            this.time = 0;
            this.callback = null;
            this.currentTime = 0;
        }
        CallbackItem.prototype.remove = function () {
            this._ready = true;
            delete this.parent.tweens[this.key];
            if (!Object.keys(this.parent.tweens).length) {
                this.parent.active = false;
                this.parent.onUpdate = null;
                delete _activeTweenObjects[this.obj._tweenObjectId];
            }
        };
        CallbackItem.prototype.set = function (obj, callback, time) {
            this.obj = obj.object;
            if (!this.obj._currentCallbackID) {
                this.obj._currentCallbackID = 1;
            }
            else {
                this.obj._currentCallbackID++;
            }
            this.time = time;
            this.parent = obj;
            this.callback = callback;
            this._ready = false;
            this.key = "cb_" + this.obj._currentCallbackID;
            this.currentTime = 0;
            if (!this.parent.active) {
                this.parent.active = true;
                _activeTweenObjects[this.obj._tweenObjectId] = this.parent;
            }
        };
        CallbackItem.prototype.update = function (delta) {
            this.currentTime += delta;
            if (this.currentTime >= this.time) {
                this.remove();
                this.callback.call(this.parent);
            }
        };
        return CallbackItem;
    }());
    var TweenItem = /** @class */ (function () {
        function TweenItem() {
            this._ready = false;
            this.parent = null;
            this.obj = null;
            this.key = '';
            this.from = 0;
            this.to = 0;
            this.time = 0;
            this.ease = 0;
            this.currentTime = 0;
            this.t = 0;
            this.isColor = false;
        }
        TweenItem.prototype.remove = function () {
            this._ready = true;
            delete this.parent.tweens[this.key];
            if (!Object.keys(this.parent.tweens).length) {
                this.parent.active = false;
                delete _activeTweenObjects[this.obj._tweenObjectId];
            }
        };
        TweenItem.prototype.set = function (obj, key, from, to, time, ease) {
            this.isColor = isNaN(from) && from[0] === '#' || isNaN(to) && to[0] === '#';
            this.parent = obj;
            this.obj = obj.object;
            this.key = key;
            this.surfix = getSurfix(to);
            if (this.isColor) {
                this.to = Helpers.hexToRgb(to);
                this.from = Helpers.hexToRgb(from);
                this.currentColor = { r: this.from.r, g: this.from.g, b: this.from.b };
            }
            else {
                this.to = getToValue(to);
                this.from = getFromValue(from, to, this.obj, key);
            }
            this.time = time;
            this.currentTime = 0;
            this.ease = ease;
            this._ready = false;
            if (!this.parent.active) {
                this.parent.active = true;
                _activeTweenObjects[this.obj._tweenObjectId] = this.parent;
            }
        };
        TweenItem.prototype.update = function (delta) {
            this.currentTime += delta;
            this.t = Math.min(this.currentTime, this.time) / this.time;
            if (this.ease) {
                this.t = this.ease.getPosition(this.t);
            }
            if (this.isColor) {
                this.currentColor.r = Math.round(Helpers.Lerp(this.from.r, this.to.r, this.t));
                this.currentColor.g = Math.round(Helpers.Lerp(this.from.g, this.to.g, this.t));
                this.currentColor.b = Math.round(Helpers.Lerp(this.from.b, this.to.b, this.t));
                this.obj[this.key] = Helpers.rgbToNumber(this.currentColor.r, this.currentColor.g, this.currentColor.b);
            }
            else {
                var val = Helpers.Lerp(this.from, this.to, this.t);
                this.obj[this.key] = this.surfix ? val + this.surfix : val;
            }
            if (this.currentTime >= this.time) {
                this.remove();
            }
        };
        return TweenItem;
    }());
    var widthKeys = ['width', 'minWidth', 'maxWidth', 'anchorLeft', 'anchorRight', 'left', 'right', 'x'];
    var heightKeys = ['height', 'minHeight', 'maxHeight', 'anchorTop', 'anchorBottom', 'top', 'bottom', 'y'];
    function getFromValue(from, to, obj, key) {
        // both number
        if (!isNaN(from) && !isNaN(to)) {
            return from;
        }
        // both percentage
        if (isNaN(from) && isNaN(to) && from.indexOf('%') !== -1 && to.indexOf('%') !== -1) {
            return parseFloat(from.replace('%', ''));
        }
        // convert from to px
        if (isNaN(from) && !isNaN(to) && from.indexOf('%') !== -1) {
            if (widthKeys.indexOf(key) !== -1) {
                return obj.parent._width * (parseFloat(from.replace('%', '')) * 0.01);
            }
            else if (heightKeys.indexOf(key) !== -1) {
                return obj.parent._height * (parseFloat(from.replace('%', '')) * 0.01);
            }
            return 0;
        }
        // convert from to percentage
        if (!isNaN(from) && isNaN(to) && to.indexOf('%') !== -1) {
            if (widthKeys.indexOf(key) !== -1) {
                return from / obj.parent._width * 100;
            }
            else if (heightKeys.indexOf(key) !== -1) {
                return from / obj.parent._height * 100;
            }
            return 0;
        }
        return 0;
    }
    function getSurfix(to) {
        if (isNaN(to) && to.indexOf('%') !== -1) {
            return '%';
        }
    }
    function getToValue(to) {
        if (!isNaN(to)) {
            return to;
        }
        if (isNaN(to) && to.indexOf('%') !== -1) {
            return parseFloat(to.replace('%', ''));
        }
    }
    function getObject(obj) {
        if (!obj._tweenObjectId) {
            obj._tweenObjectId = _currentId;
            _currentId++;
        }
        var object = _tweenObjects[obj._tweenObjectId];
        if (!object) {
            object = _tweenObjects[obj._tweenObjectId] = new TweenObject(obj);
        }
        return object;
    }
    function getTweenItem() {
        for (var i = 0; i < _tweenItemCache.length; i++) {
            if (_tweenItemCache[i]._ready) {
                return _tweenItemCache[i];
            }
        }
        var tween = new TweenItem();
        _tweenItemCache.push(tween);
        return tween;
    }
    function getCallbackItem() {
        for (var i = 0; i < _callbackItemCache.length; i++) {
            if (_callbackItemCache[i]._ready) {
                return _callbackItemCache[i];
            }
        }
        var cb = new CallbackItem();
        _callbackItemCache.push(cb);
        return cb;
    }
    var Tween = {
        to: function (obj, time, params, ease) {
            var object = getObject(obj);
            var onUpdate = null;
            for (var key in params) {
                if (key === 'onComplete') {
                    var cb = getCallbackItem();
                    cb.set(object, params[key], time);
                    object.tweens[cb.key] = cb;
                    continue;
                }
                if (key === 'onUpdate') {
                    onUpdate = params[key];
                    continue;
                }
                if (time) {
                    var match = params[key] === obj[key];
                    if (typeof obj[key] === 'undefined')
                        continue;
                    if (match) {
                        if (object.tweens[key])
                            object.tweens[key].remove();
                    }
                    else {
                        if (!object.tweens[key]) {
                            object.tweens[key] = getTweenItem();
                        }
                        object.tweens[key].set(object, key, obj[key], params[key], time, ease);
                    }
                }
            }
            if (time) {
                object.onUpdate = onUpdate;
            }
            else
                this.set(obj, params);
        },
        from: function (obj, time, params, ease) {
            var object = getObject(obj);
            var onUpdate = null;
            for (var key in params) {
                if (key === 'onComplete') {
                    var cb = getCallbackItem();
                    cb.set(object, params[key], time);
                    object.tweens[cb.key] = cb;
                    continue;
                }
                if (key === 'onUpdate') {
                    onUpdate = params[key];
                    continue;
                }
                if (time) {
                    var match = params[key] == obj[key];
                    if (typeof obj[key] === 'undefined')
                        continue;
                    if (match) {
                        if (object.tweens[key])
                            object.tweens[key].remove();
                    }
                    else {
                        if (!object.tweens[key]) {
                            object.tweens[key] = getTweenItem();
                        }
                        object.tweens[key].set(object, key, params[key], obj[key], time, ease);
                    }
                }
            }
            if (time) {
                object.onUpdate = onUpdate;
            }
            else
                this.set(obj, params);
        },
        fromTo: function (obj, time, paramsFrom, paramsTo, ease) {
            var object = getObject(obj);
            var onUpdate = null;
            for (var key in paramsTo) {
                if (key === 'onComplete') {
                    var cb = getCallbackItem();
                    cb.set(object, paramsTo[key], time);
                    object.tweens[cb.key] = cb;
                    continue;
                }
                if (key === 'onUpdate') {
                    onUpdate = paramsTo[key];
                    continue;
                }
                if (time) {
                    var match = paramsFrom[key] == paramsTo[key];
                    if (typeof obj[key] === 'undefined' || typeof paramsFrom[key] === 'undefined')
                        continue;
                    if (match) {
                        if (object.tweens[key])
                            object.tweens[key].remove();
                        obj[key] = paramsTo[key];
                    }
                    else {
                        if (!object.tweens[key]) {
                            object.tweens[key] = getTweenItem();
                        }
                        object.tweens[key].set(object, key, paramsFrom[key], paramsTo[key], time, ease);
                    }
                }
            }
            if (time) {
                object.onUpdate = onUpdate;
            }
            else
                this.set(obj, paramsTo);
        },
        set: function (obj, params) {
            var object = getObject(obj);
            for (var key in params) {
                if (typeof obj[key] === 'undefined')
                    continue;
                if (object.tweens[key])
                    object.tweens[key].remove();
                obj[key] = params[key];
            }
        },
        _update: function (delta) {
            for (var id in _activeTweenObjects) {
                var object = _activeTweenObjects[id];
                for (var key in object.tweens) {
                    object.tweens[key].update(delta);
                }
                if (object.onUpdate) {
                    object.onUpdate.call(object.object, delta);
                }
            }
        },
    };

    /**
    * An UI Slider, the default width/height is 90%
    *
    * @memberof PUXI
    * @class
    * @extends Widget
    * @param options {Object} Slider settings
    * @param options.track {(PIXI.UI.SliceSprite|PIXI.UI.Sprite)}  Any type of UIOBject, will be used for the slider track
    * @param options.handle {(PIXI.UI.SliceSprite|PIXI.UI.Sprite)} will be used as slider handle
    * @param [options.fill=null] {(PIXI.UI.SliceSprite|PIXI.UI.Sprite)} will be used for slider fill
    * @param [options.vertical=false] {boolean} Direction of the slider
    * @param [options.value=0] {number} value of the slider
    * @param [options.minValue=0] {number} minimum value
    * @param [options.maxValue=100] {number} max value
    * @param [options.decimals=0] {boolean} the decimal precision (use negative to round tens and hundreds)
    * @param [options.onValueChange=null] {callback} Callback when the value has changed
    * @param [options.onValueChanging=null] {callback} Callback while the value is changing
    */
    var Slider = /** @class */ (function (_super) {
        __extends(Slider, _super);
        function Slider(options) {
            var _this = _super.call(this, 0, 0) || this;
            _this._amt = 0;
            _this._disabled = false;
            // set options
            _this.track = options.track;
            _this.handle = options.handle;
            _this.fill = options.fill || null;
            _this._minValue = options.minValue || 0;
            _this._maxValue = options.maxValue || 100;
            _this.decimals = options.decimals || 0;
            _this.vertical = options.vertical || false;
            _this.onValueChange = options.onValueChange || null;
            _this.onValueChanging = options.onValueChanging || null;
            _this.value = options.value || 50;
            _this.handle.pivot = 0.5;
            _this.addChild(_this.track);
            if (_this.fill) {
                _this.track.addChild(_this.fill);
            }
            _this.addChild(_this.handle);
            _this.handle.contentContainer.buttonMode = true;
            if (_this.vertical) {
                _this.height = '100%';
                _this.width = _this.track.width;
                _this.track.height = '100%';
                _this.handle.horizontalAlign = 'center';
                if (_this.fill) {
                    _this.fill.horizontalAlign = 'center';
                }
            }
            else {
                _this.width = '100%';
                _this.height = _this.track.height;
                _this.track.width = '100%';
                _this.handle.verticalAlign = 'middle';
                if (_this.fill) {
                    _this.fill.verticalAlign = 'middle';
                }
            }
            return _this;
        }
        Slider.prototype.update = function (soft) {
            if (soft === void 0) { soft = 0; }
            var handleSize;
            var val;
            if (this.vertical) {
                handleSize = this.handle._height || this.handle.contentContainer.height;
                val = ((this._height - handleSize) * this._amt) + (handleSize * 0.5);
                if (soft) {
                    Tween.to(this.handle, 0.3, { top: val }, Ease.Power2.easeOut);
                    if (this.fill)
                        Tween.to(this.fill, 0.3, { height: val }, Ease.Power2.easeOut);
                }
                else {
                    Tween.set(this.handle, { top: val });
                    if (this.fill)
                        Tween.set(this.fill, { height: val });
                }
            }
            else {
                handleSize = this.handle._width || this.handle.contentContainer.width;
                val = ((this._width - handleSize) * this._amt) + (handleSize * 0.5);
                if (soft) {
                    Tween.to(this.handle, 0.3, { left: val }, Ease.Power2.easeOut);
                    if (this.fill)
                        Tween.to(this.fill, 0.3, { width: val }, Ease.Power2.easeOut);
                }
                else {
                    Tween.set(this.handle, { left: val });
                    if (this.fill)
                        Tween.set(this.fill, { width: val });
                }
            }
        };
        Slider.prototype.initialize = function () {
            var _this = this;
            _super.prototype.initialize.call(this);
            var localMousePosition = new PIXI$1.Point();
            var startValue = 0;
            var maxPosition;
            var triggerValueChange = function () {
                _this.emit('change', _this.value);
                if (_this._lastChange != _this.value) {
                    _this._lastChange = _this.value;
                    if (typeof _this.onValueChange === 'function') {
                        _this.onValueChange(_this.value);
                    }
                }
            };
            var triggerValueChanging = function () {
                _this.emit('changing', _this.value);
                if (_this._lastChanging != _this.value) {
                    _this._lastChanging = _this.value;
                    if (typeof _this.onValueChanging === 'function') {
                        _this.onValueChanging(_this.value);
                    }
                }
            };
            var updatePositionToMouse = function (mousePosition, soft) {
                _this.track.contentContainer.toLocal(mousePosition, null, localMousePosition, true);
                var newPos = _this.vertical ? localMousePosition.y - _this.handle._height * 0.5 : localMousePosition.x - _this.handle._width * 0.5;
                var maxPos = _this.vertical ? _this._height - _this.handle._height : _this._width - _this.handle._width;
                _this._amt = !maxPos ? 0 : Math.max(0, Math.min(1, newPos / maxPos));
                _this.update(soft);
                triggerValueChanging();
            };
            // //Handle dragging
            var handleDrag = new DragManager(this.handle);
            handleDrag.onPress = function (event, isPressed) {
                event.stopPropagation();
            };
            handleDrag.onDragStart = function (event) {
                startValue = _this._amt;
                maxPosition = _this.vertical ? _this._height - _this.handle._height : _this._width - _this.handle._width;
            };
            handleDrag.onDragMove = function (event, offset) {
                _this._amt = !maxPosition ? 0 : Math.max(0, Math.min(1, startValue + ((_this.vertical ? offset.y : offset.x) / maxPosition)));
                triggerValueChanging();
                _this.update();
            };
            handleDrag.onDragEnd = function () {
                triggerValueChange();
                this.update();
            };
            // Bar pressing/dragging
            var trackDrag = new DragManager(this.track);
            trackDrag.onPress = function (event, isPressed) {
                if (isPressed) {
                    updatePositionToMouse(event.data.global, true);
                }
                event.stopPropagation();
            };
            trackDrag.onDragMove = function (event) {
                updatePositionToMouse(event.data.global, false);
            };
            trackDrag.onDragEnd = function () {
                triggerValueChange();
            };
        };
        Object.defineProperty(Slider.prototype, "value", {
            get: function () {
                return Helpers.Round(Helpers.Lerp(this._minValue, this._maxValue, this._amt), this.decimals);
            },
            set: function (val) {
                this._amt = (Math.max(this._minValue, Math.min(this._maxValue, val)) - this._minValue) / (this._maxValue - this._minValue);
                if (typeof this.onValueChange === 'function') {
                    this.onValueChange(this.value);
                }
                if (typeof this.onValueChanging === 'function') {
                    this.onValueChanging(this.value);
                }
                this.update();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Slider.prototype, "minValue", {
            get: function () {
                return this._minValue;
            },
            set: function (val) {
                this._minValue = val;
                this.update();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Slider.prototype, "maxValue", {
            get: function () {
                return this._maxValue;
            },
            set: function (val) {
                this._maxValue = val;
                this.update();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Slider.prototype, "disabled", {
            get: function () {
                return this._disabled;
            },
            set: function (val) {
                if (val !== this._disabled) {
                    this._disabled = val;
                    this.handle.contentContainer.buttonMode = !val;
                    this.handle.contentContainer.interactive = !val;
                    this.track.contentContainer.interactive = !val;
                }
            },
            enumerable: true,
            configurable: true
        });
        return Slider;
    }(Widget));

    /**
     * @memberof PUXI
     * @interface IScrollBarOptions
     * @property {PUXI.Sprite} track
     * @property {PUXI.Sprite} handle
     */
    /**
     * An UI scrollbar to control a ScrollingContainer
     *
     * @class
     * @extends PUXI.Slider
     * @memberof PUXI
     * @param options {Object} ScrollBar settings
     * @param options.track {(PIXI.UI.SliceSprite|PIXI.UI.Sprite)}  Any type of UIOBject, will be used for the scrollbar track
     * @param options.handle {(PIXI.UI.SliceSprite|PIXI.UI.Sprite)} will be used as scrollbar handle
     * @param options.scrollingContainer {PIXI.UI.ScrollingContainer} The container to control
     * @param [options.vertical=false] {boolean} Direction of the scrollbar
     * @param [options.autohide=false] {boolean} Hides the scrollbar when not needed
     */
    var ScrollBar = /** @class */ (function (_super) {
        __extends(ScrollBar, _super);
        function ScrollBar(options) {
            var _this = _super.call(this, {
                track: options.track,
                handle: options.handle,
                fill: null,
                vertical: options.vertical,
            }) || this;
            _this.scrollingContainer = options.scrollingContainer;
            _this.autohide = options.autohide;
            _this._hidden = false;
            return _this;
        }
        ScrollBar.prototype.initialize = function () {
            var _this = this;
            _super.prototype.initialize.call(this);
            this.decimals = 3; // up decimals to trigger ValueChanging more often
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            this.onValueChanging = function (val) {
                var sizeAmt = _this.scrollingContainer._height / _this.scrollingContainer.innerContainer.height || 0.001;
                if (sizeAmt < 1) {
                    _this.scrollingContainer.forcePctPosition(_this.vertical ? 'y' : 'x', _this._amt);
                }
            };
            this.scrollingContainer._scrollBars.push(this);
        };
        ScrollBar.prototype.alignToContainer = function () {
            var newPos;
            var size;
            var xY = this.vertical ? 'y' : 'x';
            var widthHeight = this.vertical ? 'height' : 'width';
            var topLeft = this.vertical ? 'top' : 'left';
            var _posAmt = !this.scrollingContainer.innerContainer[widthHeight]
                ? 0
                : -(this.scrollingContainer.innerContainer[xY] / this.scrollingContainer.innerContainer[widthHeight]);
            var sizeAmt = !this.scrollingContainer.innerContainer[widthHeight]
                ? 1
                : this.scrollingContainer["_" + widthHeight] / this.scrollingContainer.innerContainer[widthHeight];
            // update amt
            var diff = this.scrollingContainer.innerContainer[widthHeight] - this.scrollingContainer["_" + widthHeight];
            this._amt = !this.scrollingContainer["_" + widthHeight] || !diff
                ? 0
                : -(this.scrollingContainer.innerContainer[xY] / diff);
            if (sizeAmt >= 1) {
                size = this["_" + widthHeight];
                this.handle[topLeft] = size * 0.5;
                this.toggleHidden(true);
            }
            else {
                size = this["_" + widthHeight] * sizeAmt;
                if (this._amt > 1) {
                    size -= (this["_" + widthHeight] - size) * (this._amt - 1);
                }
                else if (this._amt < 0) {
                    size -= (this["_" + widthHeight] - size) * -this._amt;
                }
                if (this._amt < 0) {
                    newPos = size * 0.5;
                }
                else if (this._amt > 1) {
                    newPos = this["_" + widthHeight] - (size * 0.5);
                }
                else {
                    newPos = (_posAmt * this.scrollingContainer["_" + widthHeight]) + (size * 0.5);
                }
                this.handle[topLeft] = newPos;
                this.toggleHidden(false);
            }
            this.handle[widthHeight] = size;
        };
        ScrollBar.prototype.toggleHidden = function (hidden) {
            if (this.autohide) {
                if (hidden && !this._hidden) {
                    Tween.to(this, 0.2, { alpha: 0 });
                    this._hidden = true;
                }
                else if (!hidden && this._hidden) {
                    Tween.to(this, 0.2, { alpha: 1 });
                    this._hidden = false;
                }
            }
        };
        return ScrollBar;
    }(Slider));

    var Ticker = /** @class */ (function (_super) {
        __extends(Ticker, _super);
        function Ticker(autoStart) {
            var _this = _super.call(this) || this;
            _this._disabled = true;
            _this._now = 0;
            _this.DeltaTime = 0;
            _this.Time = performance.now();
            _this.Ms = 0;
            if (autoStart) {
                _this.disabled = false;
            }
            Ticker.shared = _this;
            return _this;
        }
        Object.defineProperty(Ticker.prototype, "disabled", {
            get: function () {
                return this._disabled;
            },
            set: function (val) {
                if (!this._disabled) {
                    this._disabled = true;
                }
                else {
                    this._disabled = false;
                    Ticker.shared = this;
                    this.update(performance.now(), true);
                }
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Updates the text
         *
         * @private
         */
        Ticker.prototype.update = function (time) {
            Ticker.shared._now = time;
            Ticker.shared.Ms = Ticker.shared._now - Ticker.shared.Time;
            Ticker.shared.Time = Ticker.shared._now;
            Ticker.shared.DeltaTime = Ticker.shared.Ms * 0.001;
            Ticker.shared.emit('update', Ticker.shared.DeltaTime);
            Tween._update(Ticker.shared.DeltaTime);
            if (!Ticker.shared._disabled) {
                requestAnimationFrame(Ticker.shared.update);
            }
        };
        Ticker.on = function (event, fn, context) {
            Ticker.shared.on(event, fn, context);
        };
        Ticker.once = function (event, fn, context) {
            Ticker.shared.once(event, fn, context);
        };
        Ticker.removeListener = function (event, fn) {
            Ticker.shared.removeListener(event, fn);
        };
        return Ticker;
    }(PIXI$1.utils.EventEmitter));
    Ticker.shared = new Ticker(true);

    /**
     * `ScrollWidget` masks its contents to its layout bounds and translates
     * its children when scrolling.
     *
     * @memberof PUXI
     * @class
     * @extends PUXI.InteractiveGroup
     */
    var ScrollWidget = /** @class */ (function (_super) {
        __extends(ScrollWidget, _super);
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
        function ScrollWidget(options) {
            if (options === void 0) { options = {}; }
            var _this = _super.call(this) || this;
            _this.forcePctPosition = function (direction, pct) {
                var bounds = _this.getInnerBounds();
                var container = _this.innerContainer.insetContainer;
                if (_this.scrollX && direction === 'x') {
                    container.position[direction] = -((bounds.width - _this.width) * pct);
                }
                if (_this.scrollY && direction === 'y') {
                    container.position[direction] = -((bounds.height - _this.height) * pct);
                }
                _this.scrollPosition[direction] = _this.targetPosition[direction] = container.position[direction];
            };
            _this.focusPosition = function (pos) {
                var bounds = _this.getInnerBounds();
                var container = _this.innerContainer.insetContainer;
                var dif;
                if (_this.scrollX) {
                    var x = Math.max(0, (Math.min(bounds.width, pos.x)));
                    if (x + container.x > _this.width) {
                        dif = x - _this.width;
                        container.x = -dif;
                    }
                    else if (x + container.x < 0) {
                        dif = x + container.x;
                        container.x -= dif;
                    }
                }
                if (_this.scrollY) {
                    var y = Math.max(0, (Math.min(bounds.height, pos.y)));
                    if (y + container.y > _this.height) {
                        dif = y - _this.height;
                        container.y = -dif;
                    }
                    else if (y + container.y < 0) {
                        dif = y + container.y;
                        container.y -= dif;
                    }
                }
                _this.lastPosition.copyFrom(container.position);
                _this.targetPosition.copyFrom(container.position);
                _this.scrollPosition.copyFrom(container.position);
                _this.updateScrollBars();
            };
            /**
             * @param {PIXI.Point}[velocity]
             */
            _this.setScrollPosition = function (velocity) {
                if (velocity) {
                    _this.scrollVelocity.copyFrom(velocity);
                }
                var container = _this.innerContainer.insetContainer;
                if (!_this.animating) {
                    _this.animating = true;
                    _this.lastPosition.copyFrom(container.position);
                    _this.targetPosition.copyFrom(container.position);
                    Ticker.on('update', _this.updateScrollPosition, _this);
                }
            };
            /**
             * @param {number} delta
             * @protected
             */
            _this.updateScrollPosition = function (delta) {
                _this.stop = true;
                if (_this.scrollX) {
                    _this.updateDirection('x', delta);
                }
                if (_this.scrollY) {
                    _this.updateDirection('y', delta);
                }
                if (stop) {
                    Ticker.removeListener('update', _this.updateScrollPosition);
                    _this.animating = false;
                }
            };
            /**
             * @param {'x' | 'y'} direction
             * @param {number} delta
             * @protected
             */
            _this.updateDirection = function (direction, delta) {
                var bounds = _this.getInnerBounds();
                var _a = _this, scrollPosition = _a.scrollPosition, scrollVelocity = _a.scrollVelocity, targetPosition = _a.targetPosition, lastPosition = _a.lastPosition;
                var container = _this.innerContainer.insetContainer;
                var min;
                if (direction === 'y') {
                    min = Math.round(Math.min(0, _this.height - bounds.height));
                }
                else {
                    min = Math.round(Math.min(0, _this.width - bounds.width));
                }
                if (!_this.scrolling && Math.round(scrollVelocity[direction]) !== 0) {
                    targetPosition[direction] += scrollVelocity[direction];
                    scrollVelocity[direction] = Helpers.Lerp(scrollVelocity[direction], 0, (5 + 2.5 / Math.max(_this.softness, 0.01)) * delta);
                    if (targetPosition[direction] > 0) {
                        targetPosition[direction] = 0;
                    }
                    else if (targetPosition[direction] < min) {
                        targetPosition[direction] = min;
                    }
                }
                if (!_this.scrolling
                    && Math.round(scrollVelocity[direction]) === 0
                    && (container[direction] > 0
                        || container[direction] < min)) {
                    var target = _this.scrollPosition[direction] > 0 ? 0 : min;
                    scrollPosition[direction] = Helpers.Lerp(scrollPosition[direction], target, (40 - (30 * _this.softness)) * delta);
                    _this.stop = false;
                }
                else if (_this.scrolling || Math.round(scrollVelocity[direction]) !== 0) {
                    if (_this.scrolling) {
                        scrollVelocity[direction] = _this.scrollPosition[direction] - lastPosition[direction];
                        lastPosition.copyFrom(scrollPosition);
                    }
                    if (targetPosition[direction] > 0) {
                        scrollVelocity[direction] = 0;
                        scrollPosition[direction] = 100 * _this.softness * (1 - Math.exp(targetPosition[direction] / -200));
                    }
                    else if (targetPosition[direction] < min) {
                        scrollVelocity[direction] = 0;
                        scrollPosition[direction] = min - (100 * _this.softness * (1 - Math.exp((min - targetPosition[direction]) / -200)));
                    }
                    else {
                        scrollPosition[direction] = targetPosition[direction];
                    }
                    _this.stop = false;
                }
                container.position[direction] = Math.round(scrollPosition[direction]);
                _this.updateScrollBars();
            };
            _this.mask = new PIXI$1.Graphics();
            _this.innerContainer = new InteractiveGroup();
            _this.innerBounds = new PIXI$1.Rectangle();
            _super.prototype.addChild.call(_this, _this.innerContainer);
            _this.contentContainer.addChild(_this.mask);
            _this.contentContainer.mask = _this.mask;
            _this.scrollX = options.scrollX !== undefined ? options.scrollX : false;
            _this.scrollY = options.scrollY !== undefined ? options.scrollY : false;
            _this.dragScrolling = options.dragScrolling !== undefined ? options.dragScrolling : true;
            _this.softness = options.softness !== undefined ? Math.max(Math.min(options.softness || 0, 1), 0) : 0.5;
            _this.radius = options.radius || 0;
            _this.expandMask = options.expandMask || 0;
            _this.overflowY = options.overflowY || 0;
            _this.overflowX = options.overflowX || 0;
            _this.scrollVelocity = new PIXI$1.Point();
            /**
             * Widget's position in a scroll.
             * @member {PIXI.Point}
             * @private
             */
            _this.scrollPosition = new PIXI$1.Point();
            /**
             * Position that the cursor is at, i.e. our scroll "target".
             * @member {PIXI.Point}
             * @private
             */
            _this.targetPosition = new PIXI$1.Point();
            _this.lastPosition = new PIXI$1.Point();
            _this.animating = false;
            _this.scrolling = false;
            _this._scrollBars = [];
            _this.boundCached = performance.now() - 1000;
            _this.initScrolling();
            return _this;
        }
        /**
         * Updates the mask and scroll position before rendering.
         *
         * @override
         */
        ScrollWidget.prototype.update = function () {
            _super.prototype.update.call(this);
            if (this.lastWidth !== this.width || this.lastHeight !== this.height) {
                var of = this.expandMask;
                this.mask.clear();
                this.mask.lineStyle(0);
                this.mask.beginFill(0xFFFFFF, 1);
                if (this.radius === 0) {
                    this.mask.drawRect(-of, -of, this.width + of, this.height + of);
                }
                else {
                    this.mask.drawRoundedRect(-of, -of, this.width + of, this.height + of, this.radius);
                }
                this.mask.endFill();
                this.lastWidth = this.width;
                this.lastHeight = this.height;
            }
            this.setScrollPosition();
        };
        /**
         * @param {PUXI.Widget[]} newChildren
         * @returns {ScrollWidget} this widget
         */
        ScrollWidget.prototype.addChild = function () {
            var newChildren = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                newChildren[_i] = arguments[_i];
            }
            for (var i = 0; i < newChildren.length; i++) {
                this.innerContainer.addChild(newChildren[i]);
            }
            this.getInnerBounds(true); // make sure bounds is updated instantly when a child is added
            return this;
        };
        ScrollWidget.prototype.updateScrollBars = function () {
            for (var i = 0; i < this._scrollBars.length; i++) {
                this._scrollBars[i].alignToContainer();
            }
        };
        ScrollWidget.prototype.getInnerBounds = function (force) {
            // this is a temporary fix, because we cant rely on innercontainer height if the children is positioned > 0 y.
            if (force || performance.now() - this.boundCached > 1000) {
                this.innerContainer.insetContainer.getLocalBounds(this.innerBounds);
                this.innerContainer.insetContainer.getLocalBounds(this.innerBounds);
                this.innerBounds.height = this.innerBounds.y + this.innerContainer.height;
                this.innerBounds.width = this.innerBounds.x + this.innerContainer.width;
                this.boundCached = performance.now();
            }
            return this.innerBounds;
        };
        /**
         * @override
         */
        ScrollWidget.prototype.initialize = function () {
            _super.prototype.initialize.call(this);
            if (this.scrollX || this.scrollY) {
                this.initScrolling();
            }
        };
        ScrollWidget.prototype.initScrolling = function () {
            var _this = this;
            var container = this.innerContainer.insetContainer;
            var realPosition = new PIXI$1.Point();
            var _a = this, scrollPosition = _a.scrollPosition, targetPosition = _a.targetPosition;
            // Drag scroll
            if (this.dragScrolling) {
                var drag = this.eventBroker.dnd;
                drag.onDragStart = function (e) {
                    if (!_this.scrolling) {
                        realPosition.copyFrom(container.position);
                        scrollPosition.copyFrom(container.position);
                        _this.scrolling = true;
                        _this.setScrollPosition();
                        _this.emit('scrollstart', e);
                    }
                };
                drag.onDragMove = function (_, offset) {
                    if (_this.scrollX) {
                        targetPosition.x = realPosition.x + offset.x;
                    }
                    if (_this.scrollY) {
                        targetPosition.y = realPosition.y + offset.y;
                    }
                };
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                drag.onDragEnd = function (e) {
                    if (_this.scrolling) {
                        _this.scrolling = false;
                        _this.emit('scrollend', e);
                    }
                };
            }
            // Mouse scroll
            var scrollSpeed = new PIXI$1.Point();
            var scroll = new ScrollManager(this, true);
            scroll.onMouseScroll = function (e, delta) {
                scrollSpeed.set(-delta.x * 0.2, -delta.y * 0.2);
                _this.setScrollPosition(scrollSpeed);
            };
            this.updateScrollBars();
        };
        return ScrollWidget;
    }(InteractiveGroup));

    /**
     * An UI Container object
     *
     * @memberof PUXI
     * @class
     * @extends PUXI.Widget
     * @param desc {Boolean} Sort the list descending
     * @param tweenTime {Number} if above 0 the sort will be animated
     * @param tweenEase {PIXI.UI.Ease} ease method used for animation
     */
    var SortableList = /** @class */ (function (_super) {
        __extends(SortableList, _super);
        function SortableList(desc, tweenTime, tweenEase) {
            var _this = _super.call(this, 0, 0) || this;
            _this.desc = typeof desc !== 'undefined' ? desc : false;
            _this.tweenTime = tweenTime || 0;
            _this.tweenEase = tweenEase;
            _this.items = [];
            return _this;
        }
        SortableList.prototype.addChild = function (UIObject, fnValue, fnThenBy) {
            _super.prototype.addChild.call(this, UIObject);
            if (this.items.indexOf(UIObject) === -1) {
                this.items.push(UIObject);
            }
            if (typeof fnValue === 'function') {
                UIObject._sortListValue = fnValue;
            }
            if (typeof fnThenBy === 'function') {
                UIObject._sortListThenByValue = fnThenBy;
            }
            if (!UIObject._sortListRnd) {
                UIObject._sortListRnd = Math.random();
            }
            this.sort();
        };
        SortableList.prototype.removeChild = function (UIObject) {
            if (arguments.length > 1) {
                for (var i = 0; i < arguments.length; i++) {
                    this.removeChild(arguments[i]);
                }
            }
            else {
                _super.prototype.removeChild.call(this, UIObject);
                var index = this.items.indexOf(UIObject);
                if (index !== -1) {
                    this.items.splice(index, 1);
                }
                this.sort();
            }
        };
        SortableList.prototype.sort = function (instant) {
            var _this = this;
            if (instant === void 0) { instant = false; }
            clearTimeout(this._sortTimeout);
            if (instant) {
                this._sort();
                return;
            }
            this._sortTimeout = setTimeout(function () { _this._sort(); }, 0);
        };
        SortableList.prototype._sort = function () {
            var _this = this;
            var desc = this.desc;
            var y = 0;
            var alt = true;
            this.items.sort(function (a, b) {
                var res = a._sortListValue() < b._sortListValue() ? desc ? 1 : -1
                    : a._sortListValue() > b._sortListValue() ? desc ? -1 : 1 : 0;
                if (res === 0 && a._sortListThenByValue && b._sortListThenByValue) {
                    res = a._sortListThenByValue() < b._sortListThenByValue() ? desc ? 1 : -1
                        : a._sortListThenByValue() > b._sortListThenByValue() ? desc ? -1 : 1 : 0;
                }
                if (res === 0) {
                    res = a._sortListRnd > b._sortListRnd ? 1
                        : a._sortListRnd < b._sortListRnd ? -1 : 0;
                }
                return res;
            });
            for (var i = 0; i < this.items.length; i++) {
                var item = this.items[i];
                alt = !alt;
                if (this.tweenTime > 0) {
                    Tween.fromTo(item, this.tweenTime, { x: item.x, y: item.y }, { x: 0, y: y }, this.tweenEase);
                }
                else {
                    item.x = 0;
                    item.y = y;
                }
                y += item.height;
                if (typeof item.altering === 'function') {
                    item.altering(alt);
                }
            }
            // force it to update parents when sort animation is done (prevent scrolling container bug)
            if (this.tweenTime > 0) {
                setTimeout(function () {
                    _this.updatesettings(false, true);
                }, this.tweenTime * 1000);
            }
        };
        return SortableList;
    }(InteractiveGroup));

    /**
     * A sliced sprite with dynamic width and height.
     *
     * @class
     * @memberof PUXI
     * @param Texture {PIXI.Texture} the texture for this SliceSprite
     * @param BorderWidth {Number} Width of the sprite borders
     * @param horizontalSlice {Boolean} Slice the sprite horizontically
     * @param verticalSlice {Boolean} Slice the sprite vertically
     * @param [tile=false] {Boolean} tile or streach
     */
    var SliceSprite = /** @class */ (function (_super) {
        __extends(SliceSprite, _super);
        function SliceSprite(texture, borderWidth, horizontalSlice, verticalSlice, tile) {
            var _this = _super.call(this, texture.width, texture.height) || this;
            _this.bw = borderWidth || 5;
            _this.vs = typeof verticalSlice !== 'undefined' ? verticalSlice : true;
            _this.hs = typeof horizontalSlice !== 'undefined' ? horizontalSlice : true;
            _this.t = texture.baseTexture;
            _this.f = texture.frame;
            _this.tile = tile;
            if (_this.hs) {
                _this.setting.minWidth = borderWidth * 2;
            }
            if (_this.vs) {
                _this.setting.minHeight = borderWidth * 2;
            }
            /**
         * Updates the sliced sprites position and size
         *
         * @private
         */
            _this.update = function () {
                if (!this.initialized)
                    return;
                if (vs && hs) {
                    str.x = sbr.x = sr.x = this._width - bw;
                    sbl.y = sbr.y = sb.y = this._height - bw;
                    sf.width = st.width = sb.width = this._width - bw * 2;
                    sf.height = sl.height = sr.height = this._height - bw * 2;
                }
                else if (hs) {
                    sr.x = this._width - bw;
                    sl.height = sr.height = sf.height = this._height;
                    sf.width = this._width - bw * 2;
                }
                else { // vs
                    sb.y = this._height - bw;
                    st.width = sb.width = sf.width = this._width;
                    sf.height = this._height - bw * 2;
                }
                if (this.tint !== null) {
                    sf.tint = this.tint;
                    if (vs && hs)
                        stl.tint = str.tint = sbl.tint = sbr.tint = this.tint;
                    if (hs)
                        sl.tint = sr.tint = this.tint;
                    if (vs)
                        st.tint = sb.tint = this.tint;
                }
                if (this.blendMode !== null) {
                    sf.blendMode = this.blendMode;
                    if (vs && hs)
                        stl.blendMode = str.blendMode = sbl.blendMode = sbr.blendMode = this.blendMode;
                    if (hs)
                        sl.blendMode = sr.blendMode = this.blendMode;
                    if (vs)
                        st.blendMode = sb.blendMode = this.blendMode;
                }
            };
            return _this;
        }
        SliceSprite.prototype.initialize = function () {
            _super.prototype.initialize.call(this);
            var _a = this, f = _a.f, bw = _a.bw;
            // get frames
            if (this.vs && this.hs) {
                this.ftl = new PIXI$1.Rectangle(f.x, f.y, bw, bw);
                this.ftr = new PIXI$1.Rectangle(f.x + f.width - bw, f.y, bw, bw);
                this.fbl = new PIXI$1.Rectangle(f.x, f.y + f.height - bw, bw, bw);
                this.fbr = new PIXI$1.Rectangle(f.x + f.width - bw, f.y + f.height - bw, bw, bw);
                this.ft = new PIXI$1.Rectangle(f.x + bw, f.y, f.width - bw * 2, bw);
                this.fb = new PIXI$1.Rectangle(f.x + bw, f.y + f.height - bw, f.width - bw * 2, bw);
                this.fl = new PIXI$1.Rectangle(f.x, f.y + bw, bw, f.height - bw * 2);
                this.fr = new PIXI$1.Rectangle(f.x + f.width - bw, f.y + bw, bw, f.height - bw * 2);
                this.ff = new PIXI$1.Rectangle(f.x + bw, f.y + bw, f.width - bw * 2, f.height - bw * 2);
            }
            else if (this.hs) {
                this.fl = new PIXI$1.Rectangle(this.f.x, f.y, bw, f.height);
                this.fr = new PIXI$1.Rectangle(f.x + f.width - bw, f.y, bw, f.height);
                this.ff = new PIXI$1.Rectangle(f.x + bw, f.y, f.width - bw * 2, f.height);
            }
            else { // vs
                this.ft = new PIXI$1.Rectangle(f.x, f.y, f.width, bw);
                this.fb = new PIXI$1.Rectangle(f.x, f.y + f.height - bw, f.width, bw);
                this.ff = new PIXI$1.Rectangle(f.x, f.y + bw, f.width, f.height - bw * 2);
            }
            // TODO: swap frames if rotation
            var _b = this, t = _b.t, ff = _b.ff, fl = _b.fl, fr = _b.fr, ft = _b.ft, fb = _b.fb;
            // make sprites
            this.sf = this.tile
                ? new PIXI$1.extras.TilingSprite(new PIXI$1.Texture(t, ff))
                : new PIXI$1.Sprite(new PIXI$1.Texture(t, ff));
            this.contentContainer.addChildAt(this.sf, 0);
            if (this.vs && this.hs) {
                this.stl = new PIXI$1.Sprite(new PIXI$1.Texture(t, this.ftl));
                this.str = new PIXI$1.Sprite(new PIXI$1.Texture(t, this.ftr));
                this.sbl = new PIXI$1.Sprite(new PIXI$1.Texture(t, this.fbl));
                this.sbr = new PIXI$1.Sprite(new PIXI$1.Texture(t, this.fbr));
                this.contentContainer.addChildAt(this.stl, 0);
                this.contentContainer.addChildAt(this.str, 0);
                this.contentContainer.addChildAt(this.sbl, 0);
                this.contentContainer.addChildAt(this.sbr, 0);
            }
            if (hs) {
                this.sl = this.tile
                    ? new PIXI$1.extras.TilingSprite(new PIXI$1.Texture(t, fl))
                    : new PIXI$1.Sprite(new PIXI$1.Texture(t, fl));
                this.sr = this.tile
                    ? new PIXI$1.extras.TilingSprite(new PIXI$1.Texture(t, fr))
                    : new PIXI$1.Sprite(new PIXI$1.Texture(t, fr));
                this.contentContainer.addChildAt(this.sl, 0);
                this.contentContainer.addChildAt(this.sr, 0);
            }
            if (this.vs) {
                this.st = this.tile
                    ? new PIXI$1.extras.TilingSprite(new PIXI$1.Texture(t, ft))
                    : new PIXI$1.Sprite(new PIXI$1.Texture(t, ft));
                this.sb = this.tile
                    ? new PIXI$1.extras.TilingSprite(new PIXI$1.Texture(t, fb))
                    : new PIXI$1.Sprite(new PIXI$1.Texture(t, fb));
                this.contentContainer.addChildAt(this.st, 0);
                this.contentContainer.addChildAt(this.sb, 0);
            }
            // set constant position and sizes
            if (this.vs && this.hs) {
                this.st.x = bw;
                this.sb.x = bw;
                this.sl.y = bw;
                this.sr.y = bw;
                this.stl.width = bw;
                this.str.width = bw;
                this.sbl.width = bw;
                this.sbr.width = bw;
                this.stl.height = bw;
                this.str.height = bw;
                this.sbl.height = bw;
                this.sbr.height = bw;
            }
            if (this.hs) {
                this.sf.x = this.sl.width = this.sr.width = bw;
            }
            if (this.vs) {
                this.sf.y = this.st.height = this.sb.height = bw;
            }
        };
        SliceSprite.prototype.update = function () {
            // NO updates
        };
        return SliceSprite;
    }(Widget));

    /**
     * An UI sprite object
     *
     * @memberof PUXI
     * @class
     * @extends PUXI.Widget
     */
    var Sprite = /** @class */ (function (_super) {
        __extends(Sprite, _super);
        function Sprite(texture) {
            var _this = _super.call(this) || this;
            _this.spriteDisplay = new PIXI$1.Sprite(texture);
            _this.contentContainer.addChild(_this.spriteDisplay);
            return _this;
        }
        Sprite.prototype.update = function () {
            if (this.tint !== null) {
                this.spriteDisplay.tint = this.tint;
            }
            if (this.blendMode !== null) {
                this.spriteDisplay.blendMode = this.blendMode;
            }
        };
        Sprite.fromImage = function (imageUrl) {
            return new Sprite(new PIXI$1.Texture(new PIXI$1.BaseTexture(imageUrl)));
        };
        return Sprite;
    }(Widget));

    var Controller = /** @class */ (function (_super) {
        __extends(Controller, _super);
        function Controller(stage) {
            var _this = _super.call(this) || this;
            _this.stage = stage;
            return _this;
        }
        return Controller;
    }(PIXI$1.utils.EventEmitter));
    /**
     * A controller handles a stage-level state that can be held by wigets. For example,
     * `PUXI.FocusController` handles which widget is focused.
     *
     * @memberof PUXI
     * @class Controller
     */
    /**
     * Enables the widget to enter the controller's state.
     *
     * @memberof PUXI.Controller#
     * @method in
     * @param {PUXI.Widget} widget
     */
    /**
     * Disables the widget from the controller's state.
     *
     * @memberof PUXI.Controller#
     * @method out
     * @param {PUXI.Widget} widget
     */

    /**
     * Check boxes use this controller to deselect other checkboxes in the group when
     * they are selected.
     *
     * @memberof PUXI
     * @class
     * @extends PUXI.Controller
     */
    var CheckBoxGroupController = /** @class */ (function (_super) {
        __extends(CheckBoxGroupController, _super);
        function CheckBoxGroupController(stage) {
            var _this = _super.call(this, stage) || this;
            _this.checkGroups = new Map();
            return _this;
        }
        /**
         * @param {PUXI.CheckBox} widget
         * @param {PUXI.CheckGroup} checkGroup
         * @override
         */
        CheckBoxGroupController.prototype.in = function (widget, checkGroup) {
            if (!checkGroup) {
                throw new Error('Default check groups don\'t exist!');
            }
            var group = this.checkGroups.get(checkGroup) || this.initGroup(checkGroup);
            group.checks.push(widget);
            widget.checkGroup = checkGroup;
        };
        /**
         * @override
         */
        CheckBoxGroupController.prototype.out = function (widget) {
            var group = this.checkGroups.get(widget.checkGroup);
            var i = group.checks.indexOf(widget);
            if (i > 0) {
                group.checks.splice(i, 1);
            }
            widget.checkGroup = null;
        };
        /**
         * Called when a checkbox is selected. Do not call from outside.
         *
         * @param {CheckBox} widget
         */
        CheckBoxGroupController.prototype.notifyCheck = function (widget) {
            var group = this.checkGroups.get(widget.checkGroup);
            if (!group) {
                return;
            }
            var checks = group.checks;
            for (var i = 0, j = checks.length; i < j; i++) {
                if (checks[i] !== widget) {
                    checks[i].checked = false;
                }
            }
            group.selected = widget;
        };
        /**
         * @param {PUXI.CheckGroup} group
         * @returns {CheckBox} the selected checkbox in the group
         */
        CheckBoxGroupController.prototype.getSelected = function (group) {
            var _a;
            return (_a = this.checkGroups.get(group)) === null || _a === void 0 ? void 0 : _a.selected;
        };
        /**
         * Ensures that the check group exists in `this.checkGroups`.
         *
         * @param {PUXI.CheckGroup} id
         * @protected
         */
        CheckBoxGroupController.prototype.initGroup = function (id) {
            var cgroup = {
                checks: [],
                selected: null,
            };
            this.checkGroups.set(id, cgroup);
            return cgroup;
        };
        return CheckBoxGroupController;
    }(Controller));

    /**
     * Pressing tab on a focused widget will make the next widget its tab group
     * focused. If no tab group is specified for a focusable widget, then it
     * has the `'default'` tab group.
     *
     * @memberof PUXI
     * @typedef {string} TabGroup
     */
    /**
     * @memberof PUXI
     * @class
     * @extends PUXI.Controller
     */
    var FocusController = /** @class */ (function (_super) {
        __extends(FocusController, _super);
        function FocusController(stage) {
            var _this = _super.call(this, stage) || this;
            /**
             * Map of tab-group names to the widgets in those groups.
             * @member {Map<PUXI.TabGroup, PUXI.FocusableWidget[]>}
             * @protected
             */
            _this.tabGroups = new Map();
            /**
             * Whether to enable tab-based focus movement.
             * @member {boolean}
             */
            _this.useTab = true;
            /**
             * Whether to enable forward arrow key focus movement.
             * @member {boolean}
             */
            _this.useForward = true;
            /**
             * Whether to enable back arrow key focus movement.
             * @member {boolean}
             */
            _this.useBack = true;
            return _this;
        }
        /**
         * Adds the (focusable) widget to the tab group so that pressing tab repeatedly
         * will eventually bring it into focus.
         *
         * @param {PUXI.FocusableWidget} widget - the widget to add
         * @param {number}[tabIndex=0] - unique index for the widget in tab group used for ordering
         * @param {PUXI.TabGroup}[tabGroup='default'] - tab group name
         */
        FocusController.prototype.in = function (widget, tabIndex, tabGroup) {
            if (tabIndex === void 0) { tabIndex = 0; }
            if (tabGroup === void 0) { tabGroup = 'default'; }
            var widgets = this.tabGroups.get(tabGroup);
            if (!widgets) {
                widgets = [];
                this.tabGroups.set(tabGroup, widgets);
            }
            var i = widgets.indexOf(widget);
            // Push widget into tab group list if not present already.
            if (i === -1) {
                widget.tabIndex = tabIndex !== undefined ? tabIndex : -1;
                widget.tabGroup = tabGroup;
                widgets.push(widget);
                widgets.sort(function (a, b) { return a.tabIndex - b.tabIndex; });
            }
        };
        /**
         * @param {PUXI.FocusableWidget} widget
         * @override
         */
        FocusController.prototype.out = function (widget) {
            var widgets = this.tabGroups.get(widget.tabGroup);
            if (!widgets) {
                return;
            }
            var i = widgets.indexOf(widget);
            if (i !== -1) {
                // Widgets should already be sorted & so deleting should not unsort it.
                widgets.splice(i, 1);
            }
        };
        /**
         * Called when a widget comes into focus. Do not call this yourself.
         *
         * @param {FocusableWidget} widget
         */
        FocusController.prototype.notifyFocus = function (widget) {
            var lastItem = this.currentItem;
            if (lastItem) {
                lastItem.blur();
                this.emit('blur', lastItem);
            }
            this.currentItem = widget;
            this.emit('focus', widget);
            this.emit('focusChanged', widget, lastItem);
        };
        /**
         * Clears the currently focused item without blurring it. It is called
         * when a widget goes out of focus.
         */
        FocusController.prototype.notifyBlur = function () {
            this.emit('blur', this.currentItem);
            this.emit('focusChanged', null, this.currentItem);
            this.currentItem = null;
        };
        /**
         * Brings the widget into focus.
         *
         * @param {FocusableWidget} item
         */
        FocusController.prototype.focus = function (item) {
            var lastItem = this.currentItem;
            if (lastItem) {
                lastItem.blur();
                this.emit('blur', lastItem);
            }
            item.focus();
            this.emit('focus', item);
            this.emit('focusChanged', item, lastItem);
        };
        /**
         * Blurs the currently focused widget out of focus.
         */
        FocusController.prototype.blur = function () {
            if (this.currentItem) {
                this.currentItem.blur();
                this.emit('blur', this.currentItem);
                this.emit('focusChanged', null, this.currentItem);
                this.currentItem = null;
            }
        };
        /**
         * Called when tab is pressed on a focusable widget.
         */
        FocusController.prototype.onTab = function () {
            var _a = this, tabGroups = _a.tabGroups, currentItem = _a.currentItem;
            if (currentItem) {
                var tabGroup = tabGroups.get(currentItem.tabGroup);
                var i = tabGroup.indexOf(currentItem) + 1;
                if (i >= tabGroup.length) {
                    i = 0;
                }
                this.focus(tabGroup[i]);
            }
        };
        /**
         * Focuses the next item without wrapping, i.e. it does not go to the first
         * item if the current one is the last item. This is called when the user
         * presses the forward arrow key.
         */
        FocusController.prototype.onForward = function () {
            if (!this.useForward) {
                return;
            }
            var _a = this, currentItem = _a.currentItem, tabGroups = _a.tabGroups;
            if (currentItem) {
                var tabGroup = tabGroups.get(currentItem.tabGroup);
                var i = tabGroup.indexOf(currentItem) + 1;
                if (i >= tabGroup.length) {
                    i = tabGroup.length - 1;
                }
                this.focus(tabGroup[i]);
            }
        };
        /**
         * Focuses the last item without wrapping, i.e. it does not go to the last
         * item if the current item is the first one. This is called when the user
         * presses the back arrow button.
         */
        FocusController.prototype.onBack = function () {
            var _a = this, currentItem = _a.currentItem, tabGroups = _a.tabGroups;
            if (currentItem) {
                var tabGroup = tabGroups.get(currentItem.tabGroup);
                var i = tabGroup.indexOf(currentItem) - 1;
                if (i < 0)
                    i = 0;
                this.focus(tabGroup[i]);
            }
        };
        return FocusController;
    }(Controller));

    /**
     * The stage is the root node in the PUXI scene graph. It does not provide a
     * sophisticated layout model; however, it will accept constraints defined by
     * `PUXI.FastLayoutOptions` or `PUXI.LayoutOptions` in its children.
     *
     * The stage is not a `PUXI.Widget` and its dimensions are always fixed.
     *
     * @memberof PUXI
     * @class
     * @extends PIXI.Container
     */
    var Stage = /** @class */ (function (_super) {
        __extends(Stage, _super);
        /**
         * @param {number} width - width of the stage
         * @param {number} height - height of the stage
         */
        function Stage(width, height) {
            var _this = _super.call(this) || this;
            _this.__width = width;
            _this.__height = height;
            _this.minWidth = 0;
            _this.minHeight = 0;
            _this.widgetChildren = [];
            _this.interactive = true;
            _this.stage = _this;
            _this.hitArea = new PIXI$1.Rectangle(0, 0, 0, 0);
            _this.initialized = true;
            _this.resize(width, height);
            _this._checkBoxGroupCtl = new Stage.CHECK_BOX_GROUP_CONTROLLER(_this);
            _this._focusCtl = new Stage.FOCUS_CONTROLLER(_this);
            return _this;
        }
        Stage.prototype.measureAndLayout = function () {
            if (this.background) {
                this.background.width = this.width;
                this.background.height = this.height;
            }
            for (var i = 0, j = this.widgetChildren.length; i < j; i++) {
                var widget = this.widgetChildren[i];
                var lopt = (widget.layoutOptions || LayoutOptions.DEFAULT);
                var widthMeasureMode = lopt.width < LayoutOptions.MAX_DIMEN
                    ? exports.MeasureMode.EXACTLY
                    : exports.MeasureMode.AT_MOST;
                var heightMeasureMode = lopt.height < LayoutOptions.MAX_DIMEN
                    ? exports.MeasureMode.EXACTLY
                    : exports.MeasureMode.AT_MOST;
                var loptWidth = (Math.abs(lopt.width) < 1) ? lopt.width * this.width : lopt.width;
                var loptHeight = (Math.abs(lopt.height) < 1) ? lopt.height * this.height : lopt.height;
                widget.measure(widthMeasureMode === exports.MeasureMode.EXACTLY ? loptWidth : this.width, heightMeasureMode === exports.MeasureMode.EXACTLY ? loptHeight : this.height, widthMeasureMode, heightMeasureMode);
                var x = lopt.x ? lopt.x : 0;
                var y = lopt.y ? lopt.y : 0;
                if (Math.abs(x) < 1) {
                    x *= this.width;
                }
                if (Math.abs(y) < 1) {
                    y *= this.height;
                }
                var anchor = lopt.anchor || FastLayoutOptions.DEFAULT_ANCHOR;
                var l = x - (anchor.x * widget.getMeasuredWidth());
                var t = y - (anchor.y * widget.getMeasuredHeight());
                widget.layout(l, t, l + widget.getMeasuredWidth(), t + widget.getMeasuredHeight(), true);
            }
        };
        Stage.prototype.getBackground = function () {
            return this.background;
        };
        Stage.prototype.setBackground = function (bg) {
            if (this.background) {
                _super.prototype.removeChild.call(this, this.background);
            }
            this.background = bg;
            if (bg) {
                _super.prototype.addChildAt.call(this, bg, 0);
                this.background.width = this.width;
                this.background.height = this.height;
            }
        };
        Stage.prototype.update = function (widgets) {
            for (var i = 0, j = widgets.length; i < j; i++) {
                var widget = widgets[i];
                widget.stage = this;
                if (!widget.initialized) {
                    widget.initialize();
                }
                this.update(widget.widgetChildren);
                widget.update();
            }
        };
        Stage.prototype.render = function (renderer) {
            this.update(this.widgetChildren);
            _super.prototype.render.call(this, renderer);
        };
        Stage.prototype.addChild = function (UIObject) {
            var argumentLenght = arguments.length;
            if (argumentLenght > 1) {
                for (var i = 0; i < argumentLenght; i++) {
                    this.addChild(arguments[i]);
                }
            }
            else {
                if (UIObject.parent) {
                    UIObject.parent.removeChild(UIObject);
                }
                UIObject.parent = this;
                this.widgetChildren.push(UIObject);
                _super.prototype.addChild.call(this, UIObject.insetContainer);
                // UIObject.updatesettings(true);
            }
            this.measureAndLayout();
        };
        Stage.prototype.removeChild = function (UIObject) {
            var argumentLenght = arguments.length;
            if (argumentLenght > 1) {
                for (var i = 0; i < argumentLenght; i++) {
                    this.removeChild(arguments[i]);
                }
            }
            else {
                _super.prototype.removeChild.call(this, UIObject.insetContainer);
                var index = this.widgetChildren.indexOf(UIObject);
                if (index !== -1) {
                    this.children.splice(index, 1);
                    UIObject.parent = null;
                }
            }
            this.measureAndLayout();
        };
        Stage.prototype.resize = function (width, height) {
            if (!isNaN(height))
                this.__height = height;
            if (!isNaN(width))
                this.__width = width;
            if (this.minWidth || this.minHeight) {
                var rx = 1;
                var ry = 1;
                if (width && width < this.minWidth) {
                    rx = this.minWidth / width;
                }
                if (height && height < this.minHeight) {
                    ry = this.minHeight / height;
                }
                if (rx > ry && rx > 1) {
                    this.scale.set(1 / rx);
                    this.__height *= rx;
                    this.__width *= rx;
                }
                else if (ry > 1) {
                    this.scale.set(1 / ry);
                    this.__width *= ry;
                    this.__height *= ry;
                }
                else if (this.scale.x !== 1) {
                    this.scale.set(1);
                }
            }
            if (this.hitArea) {
                this.hitArea.width = this.__width;
                this.hitArea.height = this.__height;
            }
            for (var i = 0; i < this.widgetChildren.length; i++) {
                this.widgetChildren[i].updatesettings(true, false);
            }
            this.measureAndLayout();
        };
        Object.defineProperty(Stage.prototype, "width", {
            get: function () {
                return this.__width;
            },
            set: function (val) {
                if (!isNaN(val)) {
                    this.__width = val;
                    this.resize();
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Stage.prototype, "height", {
            get: function () {
                return this.__height;
            },
            set: function (val) {
                if (!isNaN(val)) {
                    this.__height = val;
                    this.resize();
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Stage.prototype, "checkBoxGroupController", {
            /**
             * The check box group controller for check boxes in this stage.
             *
             * @member {PUXI.CheckBoxGroupController}
             */
            get: function () {
                return this._checkBoxGroupCtl;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Stage.prototype, "focusController", {
            /**
             * The focus controller for widgets in this stage. You can use this to bring a
             * widget into focus.
             *
             * @member {PUXI.FocusController}
             */
            get: function () {
                return this._focusCtl;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * Use this to override which class is used for the check box group controller. It
         * should extend from `PUXI.CheckBoxGroupController`.
         *
         * @static
         */
        Stage.CHECK_BOX_GROUP_CONTROLLER = CheckBoxGroupController;
        /**
         * Use this to override which class is used for the focus controller. It should
         * extend from `PUXI.FocusController`.
         *
         * @static
         */
        Stage.FOCUS_CONTROLLER = FocusController;
        return Stage;
    }(PIXI$1.Container));

    // Dummy <input> element created for mobile keyboards
    var mockDOMInput;
    function initMockDOMInput() {
        // create temp input (for mobile keyboard)
        if (typeof mockDOMInput === 'undefined') {
            mockDOMInput = document.createElement('INPUT');
            mockDOMInput.setAttribute('type', 'text');
            mockDOMInput.setAttribute('id', '_pui_tempInput');
            mockDOMInput.setAttribute('style', 'position:fixed; left:-10px; top:-10px; width:0px; height: 0px;');
            document.body.appendChild(mockDOMInput);
        }
    }
    /**
     * An UI text object
     *
     * @class
     * @extends PIXI.UI.InputBase
     * @memberof PIXI.UI
     */
    var TextInput = /** @class */ (function (_super) {
        __extends(TextInput, _super);
        /**
         * @param {PUXI.ITextInputOptions} options
         * @param {string} options.value Text content
         * @param {boolean} [options.multiLine=false] Multiline input
         * @param options.style {PIXI.TextStyle} Style used for the Text
         * @param options.background {(PIXI.UI.SliceSprite|PIXI.UI.Sprite)} will be used as background for input
         * @param [options.selectedColor='#ffffff'] {String|Array} Fill color of selected text
         * @param [options.selectedBackgroundColor='#318cfa'] {String} BackgroundColor of selected text
         * @param [options.width=150] {Number} width of input
         * @param [options.height=20] {Number} height of input
         * @param [options.padding=3] {Number} input padding
         * @param [options.paddingTop=0] {Number} input padding
         * @param [options.paddingBottom=0] {Number} input padding
         * @param [options.paddingLeft=0] {Number} input padding
         * @param [options.paddingRight=0] {Number} input padding
         * @param [options.tabIndex=0] {Number} input tab index
         * @param [options.tabGroup=0] {Number|String} input tab group
         * @param [options.maxLength=0] {Number} 0 = unlimited
         * @param [options.caretWidth=1] {Number} width of the caret
         * @param [options.lineHeight=0] {Number} 0 = inherit from text
         */
        function TextInput(options) {
            var _this = _super.call(this, options) || this;
            _this.onKeyDown = function (e) {
                if (e.which === _this.ctrlKey || e.which === _this.cmdKey) {
                    _this.ctrlDown = true;
                }
                if (e.which === _this.shiftKey) {
                    _this.shiftDown = true;
                }
                // FocusableWidget.onKeyDownImpl should've been called before this.
                if (e.defaultPrevented) {
                    return;
                }
                if (e.which === 13) { // enter
                    _this.insertTextAtCaret('\n');
                    e.preventDefault();
                    return;
                }
                if (_this.ctrlDown) {
                    // Handle Ctrl+<?> commands
                    if (e.which === 65) {
                        // Ctrl+A (Select all)
                        _this.select();
                        e.preventDefault();
                        return;
                    }
                    else if (e.which === 90) {
                        // Ctrl+Z (Undo)
                        if (_this.value != _this._lastValue) {
                            _this.valueEvent = _this._lastValue;
                        }
                        _this.setCaretIndex(_this._lastValue.length + 1);
                        e.preventDefault();
                        return;
                    }
                }
                if (e.which === 8) {
                    // Handle backspace
                    if (!_this.deleteSelection()) {
                        if (_this.caret._index > 0 || (_this.chars.length === 1 && _this.caret._atEnd)) {
                            if (_this.caret._atEnd) {
                                _this.valueEvent = _this.value.slice(0, _this.chars.length - 1);
                                _this.setCaretIndex(_this.caret._index);
                            }
                            else {
                                _this.valueEvent = _this.value.slice(0, _this.caret._index - 1) + _this.value.slice(_this.caret._index);
                                _this.setCaretIndex(_this.caret._index - 1);
                            }
                        }
                    }
                    e.preventDefault();
                    return;
                }
                if (e.which === 46) {
                    // Delete selection
                    if (!_this.deleteSelection()) {
                        if (!_this.caret._atEnd) {
                            _this.valueEvent = _this.value.slice(0, _this.caret._index) + _this.value.slice(_this.caret._index + 1);
                            _this.setCaretIndex(_this.caret._index);
                        }
                    }
                    e.preventDefault();
                    return;
                }
                else if (e.which === 37 || e.which === 39) {
                    _this.rdd = e.which === 37;
                    if (_this.shiftDown) {
                        if (_this.hasSelection) {
                            var caretAtStart = _this.selectionStart === _this.caret._index;
                            if (caretAtStart) {
                                if (_this.selectionStart === _this.selectionEnd && _this.rdd === _this.caret._forward) {
                                    _this.setCaretIndex(_this.caret._forward ? _this.caret._index : _this.caret._index + 1);
                                }
                                else {
                                    var startindex = _this.rdd ? _this.caret._index - 1 : _this.caret._index + 1;
                                    _this.selectRange(startindex, _this.selectionEnd);
                                    _this.caret._index = Math.min(_this.chars.length - 1, Math.max(0, startindex));
                                }
                            }
                            else {
                                var endIndex = _this.rdd ? _this.caret._index - 1 : _this.caret._index + 1;
                                _this.selectRange(_this.selectionStart, endIndex);
                                _this.caret._index = Math.min(_this.chars.length - 1, Math.max(0, endIndex));
                            }
                        }
                        else {
                            var _i = _this.caret._atEnd ? _this.caret._index + 1 : _this.caret._index;
                            var selectIndex = _this.rdd ? _i - 1 : _i;
                            _this.selectRange(selectIndex, selectIndex);
                            _this.caret._index = selectIndex;
                            _this.caret._forward = !rdd;
                        }
                    }
                    else {
                        // Navigation
                        // eslint-disable-next-line no-lonely-if
                        if (_this.hasSelection) {
                            _this.setCaretIndex(_this.rdd ? _this.selectionStart : _this.selectionEnd + 1);
                        }
                        else {
                            _this.setCaretIndex(_this.caret._index + (_this.rdd ? _this.caret._atEnd ? 0 : -1 : 1));
                        }
                    }
                    e.preventDefault();
                    return;
                }
                else if (_this.multiLine && (e.which === 38 || e.which === 40)) {
                    _this.vrdd = e.which === 38;
                    if (_this.shiftDown) {
                        if (_this.hasSelection) {
                            _this.de.y = Math.max(0, Math.min(_this.textHeightPX, _this.de.y + (_this.vrdd ? -_this.lineHeight : _this.lineHeight)));
                            _this.updateClosestIndex(_this.de, false);
                            // console.log(si, ei);
                            if (Math.abs(_this.si - _this.ei) <= 1) {
                                // console.log(si, ei);
                                _this.setCaretIndex(_this.sie ? _this.si + 1 : _this.si);
                            }
                            else {
                                _this.caret._index = (_this.eie ? _this.ei + 1 : _this.ei) + (_this.caret._down ? -1 : 0);
                                _this.selectRange(_this.caret._down ? _this.si : _this.si - 1, _this.caret._index);
                            }
                        }
                        else {
                            _this.si = _this.caret._index;
                            _this.sie = false;
                            _this.de.copyFrom(_this.caret);
                            _this.de.y = Math.max(0, Math.min(_this.textHeightPX, _this.de.y + (_this.vrdd ? -_this.lineHeight : _this.lineHeight)));
                            _this.updateClosestIndex(_this.de, false);
                            _this.caret._index = (_this.eie ? _this.ei + 1 : ei) - (_this.vrdd ? 0 : 1);
                            _this.selectRange(_this.vrdd ? _this.si - 1 : _this.si, _this.caret._index);
                            _this.caret._down = !_this.vrdd;
                        }
                    }
                    else if (_this.hasSelection) {
                        _this.setCaretIndex(_this.vrdd ? _this.selectionStart : _this.selectionEnd + 1);
                    }
                    else {
                        _this.ds.copyFrom(_this.caret);
                        _this.ds.y += _this.vrdd ? -_this.lineHeight : _this.lineHeight;
                        _this.ds.x += 1;
                        _this.updateClosestIndex(_this.ds, true);
                        _this.setCaretIndex(_this.sie ? _this.si + 1 : _this.si);
                    }
                    e.preventDefault();
                    return;
                }
            };
            _this.keyUpEvent = function (e) {
                if (e.which === _this.ctrlKey || e.which === _this.cmdKey)
                    _this.ctrlDown = false;
                if (e.which === _this.shiftKey)
                    _this.shiftDown = false;
                _this.emit('keyup', e);
                if (e.defaultPrevented) {
                    return;
                }
            };
            _this.copyEvent = function (e) {
                _this.emit('copy', e);
                if (e.defaultPrevented) {
                    return;
                }
                if (_this.hasSelection) {
                    var clipboardData = e.clipboardData || window.clipboardData;
                    clipboardData.setData('Text', _this.value.slice(_this.selectionStart, _this.selectionEnd + 1));
                }
                e.preventDefault();
            };
            _this.cutEvent = function (e) {
                _this.emit('cut', e);
                if (e.defaultPrevented) {
                    return;
                }
                if (_this.hasSelection) {
                    _this.copyEvent(e);
                    _this.deleteSelection();
                }
                e.preventDefault();
            };
            _this.pasteEvent = function (e) {
                _this.emit('paste', e);
                if (e.defaultPrevented) {
                    return;
                }
                var clipboardData = e.clipboardData || window.clipboardData;
                _this.insertTextAtCaret(clipboardData.getData('Text'));
                e.preventDefault();
            };
            _this.inputEvent = function (e) {
                var c = mockDOMInput.value;
                if (c.length) {
                    _this.insertTextAtCaret(c);
                    mockDOMInput.value = '';
                }
                e.preventDefault();
            };
            _this.inputBlurEvent = function (e) {
                _this.blur();
            };
            _this.focus = function () {
                if (!_this._isFocused) {
                    _super.prototype.focus.call(_this);
                    var l = _this.contentContainer.worldTransform.tx + "px";
                    var t = _this.contentContainer.worldTransform.ty + "px";
                    var h = _this.contentContainer.height + "px";
                    var w = _this.contentContainer.width + "px";
                    mockDOMInput.setAttribute('style', "position:fixed; left:" + l + "; top:" + t + "; height:" + h + "; width:" + w + ";");
                    mockDOMInput.value = '';
                    mockDOMInput.focus();
                    mockDOMInput.setAttribute('style', 'position:fixed; left:-10px; top:-10px; width:0px; height: 0px;');
                    _this.innerContainer.cacheAsBitmap = false;
                    mockDOMInput.addEventListener('blur', _this.inputBlurEvent, false);
                    document.addEventListener('keydown', _this.onKeyDown, false);
                    document.addEventListener('keyup', _this.keyUpEvent, false);
                    document.addEventListener('paste', _this.pasteEvent, false);
                    document.addEventListener('copy', _this.copyEvent, false);
                    document.addEventListener('cut', _this.cutEvent, false);
                    mockDOMInput.addEventListener('input', _this.inputEvent, false);
                    setTimeout(function () {
                        if (!_this.caret.visible && !_this.selection.visible && !_this.multiLine) {
                            _this.setCaretIndex(_this.chars.length);
                        }
                    }, 0);
                }
            };
            _this.blur = function () {
                if (_this._isFocused) {
                    _super.prototype.blur.call(_this);
                    _this.ctrlDown = false;
                    _this.shiftDown = false;
                    _this.hideCaret();
                    _this.clearSelection();
                    if (_this.chars.length > 1) {
                        _this.innerContainer.cacheAsBitmap = true;
                    }
                    mockDOMInput.removeEventListener('blur', _this.inputBlurEvent);
                    document.removeEventListener('keydown', _this.onKeyDown);
                    document.removeEventListener('keyup', _this.keyUpEvent);
                    document.removeEventListener('paste', _this.pasteEvent);
                    document.removeEventListener('copy', _this.copyEvent);
                    document.removeEventListener('cut', _this.cutEvent);
                    mockDOMInput.removeEventListener('input', _this.inputEvent);
                    mockDOMInput.blur();
                }
                if (!_this.multiLine) {
                    _this.resetScrollPosition();
                }
            };
            _this.setCaretIndex = function (index) {
                _this.caret._atEnd = index >= _this.chars.length;
                _this.caret._index = Math.max(0, Math.min(_this.chars.length - 1, index));
                if (_this.chars.length && index > 0) {
                    var i = Math.max(0, Math.min(index, _this.chars.length - 1));
                    var c = _this.chars[i];
                    if (c && c.wrapped) {
                        _this.caret.x = c.x;
                        _this.caret.y = c.y;
                    }
                    else {
                        i = Math.max(0, Math.min(index - 1, _this.chars.length - 1));
                        c = _this.chars[i];
                        _this.caret.x = _this.chars[i].x + _this.chars[i].width;
                        _this.caret.y = (_this.chars[i].lineIndex * _this.lineHeight) + (_this.lineHeight - _this.textHeight) * 0.5;
                    }
                }
                else {
                    _this.caret.x = 0;
                    _this.caret.y = (_this.lineHeight - _this.textHeight) * 0.5;
                }
                _this.scrollToPosition(_this.caret);
                _this.showCaret();
            };
            _this.select = function () {
                _this.selectRange(0, _this.chars.length - 1);
            };
            _this.selectWord = function (wordIndex) {
                var startIndex = _this.chars.length;
                var endIndex = 0;
                for (var i = 0; i < _this.chars.length; i++) {
                    if (_this.chars[i].wordIndex !== wordIndex) {
                        continue;
                    }
                    if (i < startIndex) {
                        startIndex = i;
                    }
                    if (i > endIndex) {
                        endIndex = i;
                    }
                }
                _this.selectRange(startIndex, endIndex);
            };
            _this.selectRange = function (startIndex, endIndex) {
                if (startIndex > -1 && endIndex > -1) {
                    var start = Math.min(startIndex, endIndex, _this.chars.length - 1);
                    var end = Math.min(Math.max(startIndex, endIndex), _this.chars.length - 1);
                    if (start !== _this.selectionStart || end !== _this.selectionEnd) {
                        _this.hasSelection = true;
                        _this.selection.visible = true;
                        _this.selectionStart = start;
                        _this.selectionEnd = end;
                        _this.hideCaret();
                        _this.updateSelectionGraphics();
                        _this.updateSelectionColors();
                    }
                    _this.focus();
                }
                else {
                    _this.clearSelection();
                }
            };
            _this.clearSelection = function () {
                if (_this.hasSelection) {
                    // Remove color
                    _this.hasSelection = false;
                    _this.selection.visible = false;
                    _this.selectionStart = -1;
                    _this.selectionEnd = -1;
                    _this.updateSelectionColors();
                }
            };
            _this.updateSelectionGraphics = function () {
                var c1 = _this.chars[_this.selectionStart];
                if (c1 !== undefined) {
                    var cx = c1.x;
                    var cy = c1.y;
                    var w = 0;
                    var h = _this.textHeight;
                    var cl = c1.lineIndex;
                    _this.selection.clear();
                    for (var i = _this.selectionStart; i <= _this.selectionEnd; i++) {
                        var c = _this.chars[i];
                        if (c.lineIndex != cl) {
                            _this.drawSelectionRect(cx, cy, w, h);
                            cx = c.x;
                            cy = c.y;
                            cl = c.lineIndex;
                            w = 0;
                        }
                        w += c.width;
                    }
                    _this.drawSelectionRect(cx, cy, w, h);
                    _this.innerContainer.addChildAt(_this.selection, 0);
                }
            };
            _this.drawSelectionRect = function (x, y, w, h) {
                _this.selection.beginFill("0x" + _this.selectedBackgroundColor.slice(1), 1);
                _this.selection.moveTo(x, y);
                _this.selection.lineTo(x + w, y);
                _this.selection.lineTo(x + w, y + h);
                _this.selection.lineTo(x, y + h);
                _this.selection.endFill();
            };
            initMockDOMInput();
            _this.options = options;
            _this._dirtyText = true;
            _this.maxLength = options.maxLength || 0;
            _this._value = _this._lastValue = options.value || '';
            if (_this.maxLength) {
                _this._value = _this._value.slice(0, _this.maxLength);
            }
            _this.chars = [];
            _this.multiLine = options.multiLine !== undefined ? options.multiLine : false;
            _this.color = options.style && options.style.fill ? options.style.fill : '#000000';
            _this.selectedColor = options.selectedColor || '#ffffff';
            _this.selectedBackgroundColor = options.selectedBackgroundColor || '#318cfa';
            _this.tempText = new PIXI$1.Text('1', options.style);
            _this.textHeight = _this.tempText.height;
            _this.lineHeight = options.lineHeight || _this.textHeight || _this._height;
            _this.tempText.destroy();
            // set cursor
            // this.container.cursor = "text";
            // selection graphics
            _this.selection = new PIXI$1.Graphics();
            _this.selection.visible = false;
            _this.selection._startIndex = 0;
            _this.selection._endIndex = 0;
            // caret graphics
            _this.caret = new PIXI$1.Graphics();
            _this.caret.visible = false;
            _this.caret._index = 0;
            _this.caret.lineStyle(options.caretWidth || 1, '#ffffff', 1);
            _this.caret.moveTo(0, 0);
            _this.caret.lineTo(0, _this.textHeight);
            // var padding
            var paddingLeft = options.paddingLeft !== undefined ? options.paddingLeft : options.padding;
            var paddingRight = options.paddingRight !== undefined ? options.paddingRight : options.padding;
            var paddingBottom = options.paddingBottom !== undefined ? options.paddingBottom : options.padding;
            var paddingTop = options.paddingTop !== undefined ? options.paddingTop : options.padding;
            // insert text container (scrolling container)
            _this.textContainer = new ScrollWidget({
                scrollX: !_this.multiLine,
                scrollY: _this.multiLine,
                dragScrolling: _this.multiLine,
                expandMask: 2,
                softness: 0.2,
                overflowX: 40,
                overflowY: 40,
            }).setPadding(paddingLeft || 3, paddingTop || 3, paddingRight || 3, paddingBottom || 3).setLayoutOptions(new LayoutOptions(LayoutOptions.FILL_PARENT, LayoutOptions.FILL_PARENT));
            _this.addChild(_this.textContainer);
            if (_this.multiLine) {
                _this._useNext = _this._usePrev = false;
                _this.textContainer.dragRestrictAxis = 'y';
                _this.textContainer.dragThreshold = 5;
                _this.dragRestrictAxis = 'x';
                _this.dragThreshold = 5;
            }
            // selection Vars
            _this.sp = new PIXI$1.Point(); // startposition
            _this._sp = new PIXI$1.Point();
            _this.ds = new PIXI$1.Point(); // dragStart
            _this.de = new PIXI$1.Point(); // dragend
            _this.rdd = false; // Reverse drag direction
            _this.vrdd = false; // vertical Reverse drag direction
            _this.selectionStart = -1;
            _this.selectionEnd = -1;
            _this.hasSelection = false;
            _this.t = performance.now(); // timestamp
            _this.cc = 0; // click counter
            _this.textLengthPX = 0;
            _this.textHeightPX = 0;
            _this.lineIndexMax = 0;
            _this.ctrlDown = false;
            _this.shiftDown = false;
            _this.shiftKey = 16;
            _this.ctrlKey = 17;
            _this.cmdKey = 91;
            _this.setupDrag();
            return _this;
        }
        TextInput.prototype.setupDrag = function () {
            var _this = this;
            var event = new DragManager(this);
            event.onPress = function (e, mouseDown) {
                if (mouseDown) {
                    var timeSinceLast = performance.now() - _this.t;
                    _this.t = performance.now();
                    if (timeSinceLast < 250) {
                        _this.cc++;
                        if (_this.cc > 1) {
                            _this.select();
                        }
                        else {
                            _this.innerContainer.toLocal(_this.sp, undefined, _this.ds, true);
                            _this.updateClosestIndex(_this.ds, true);
                            var c = _this.chars[_this.si];
                            if (c) {
                                if (c.wordIndex != -1) {
                                    _this.selectWord(c.wordIndex);
                                }
                                else {
                                    _this.selectRange(_this.si, _this.si);
                                }
                            }
                        }
                    }
                    else {
                        _this.cc = 0;
                        _this.sp.copyFrom(e.data.global);
                        _this.innerContainer.toLocal(_this.sp, undefined, _this.ds, true);
                        if (_this.chars.length) {
                            _this.updateClosestIndex(_this.ds, true);
                            _this.setCaretIndex(_this.sie ? _this.si + 1 : _this.si);
                        }
                    }
                }
                e.data.originalEvent.preventDefault();
            };
            event.onDragMove = function (e, offset) {
                if (!_this.chars.length || !_this._isFocused) {
                    return;
                }
                _this.de.x = _this.sp.x + offset.x;
                _this.de.y = _this.sp.y + offset.y;
                _this.innerContainer.toLocal(_this.de, undefined, _this.de, true);
                _this.updateClosestIndex(_this.de, false);
                if (_this.si < _this.ei) {
                    _this.selectRange(_this.sie ? _this.si + 1 : _this.si, _this.eie ? _this.ei : _this.ei - 1);
                    _this.caret._index = _this.eie ? _this.ei : _this.ei - 1;
                }
                else if (_this.si > _this.ei) {
                    _this.selectRange(_this.ei, _this.sie ? _this.si : _this.si - 1);
                    _this.caret._index = _this.ei;
                }
                else if (_this.sie === _this.eie) {
                    _this.setCaretIndex(_this.sie ? _this.si + 1 : _this.si);
                }
                else {
                    _this.selectRange(_this.si, _this.ei);
                    _this.caret._index = _this.ei;
                }
                _this.caret._forward = _this.si <= _this.ei;
                _this.caret._down = offset.y > 0;
                _this.scrollToPosition(_this.de);
            };
        };
        Object.defineProperty(TextInput.prototype, "innerContainer", {
            get: function () {
                return this.textContainer.innerContainer.insetContainer;
            },
            enumerable: true,
            configurable: true
        });
        TextInput.prototype.update = function () {
            if (this.width !== this._lastWidth) {
                this._lastWidth = this._width;
                if (this.multiLine) {
                    this.updateText();
                    if (this.caret.visible) {
                        this.setCaretIndex(this.caret._index);
                    }
                    if (this.hasSelection) {
                        this.updateSelectionGraphics();
                    }
                }
            }
            // update text
            if (this._dirtyText) {
                this.updateText();
                this._dirtyText = false;
            }
        };
        TextInput.prototype.updateText = function () {
            this.textLengthPX = 0;
            this.textHeightPX = 0;
            this.lineIndexMax = 0;
            var lineIndex = 0;
            var length = this._value.length;
            var x = 0;
            var y = (this.lineHeight - this.textHeight) * 0.5;
            var i = 0;
            // destroy excess chars
            if (this.chars.length > length) {
                for (i = this.chars.length - 1; i >= length; i--) {
                    this.innerContainer.removeChild(this.chars[i]);
                    this.chars[i].destroy();
                }
                this.chars.splice(length, this.chars.length - length);
            }
            // update and add chars
            var whitespace = false;
            var newline = false;
            var wordIndex = 0;
            var lastWordIndex = -1;
            var wrap = false;
            for (i = 0; i < this._value.length; i++) {
                if (whitespace || newline) {
                    lastWordIndex = i;
                    wordIndex++;
                }
                var c = this._value[i];
                whitespace = c === ' ';
                newline = c === '\n';
                if (newline) { // newline "hack". webgl render errors if \n is passed to text
                    c = '';
                }
                var charText = this.chars[i];
                if (!charText) {
                    charText = new PIXI$1.Text(c, this.options.style);
                    this.innerContainer.addChild(charText);
                    this.chars.push(charText);
                }
                else {
                    charText.text = c;
                }
                charText.scale.x = newline ? 0 : 1;
                charText.wrapped = wrap;
                wrap = false;
                if (newline || (this.multiLine && x + charText.width >= this._width - this.paddingLeft - this.paddingRight)) {
                    lineIndex++;
                    x = 0;
                    y += this.lineHeight;
                    if (lastWordIndex !== -1 && !newline) {
                        i = lastWordIndex - 1;
                        lastWordIndex = -1;
                        wrap = true;
                        continue;
                    }
                }
                charText.lineIndex = lineIndex;
                charText.x = x;
                charText.y = y;
                charText.wordIndex = whitespace || newline ? -1 : wordIndex;
                x += charText.width;
                if (x > this.textLengthPX) {
                    this.textLengthPX = x;
                }
                if (y > this.textHeightPX) {
                    this.textHeightPX = y;
                }
            }
            this.lineIndexMax = lineIndex;
            // put caret on top
            this.innerContainer.addChild(this.caret);
            // recache
            if (this.innerContainer.cacheAsBitmap) {
                this.innerContainer.cacheAsBitmap = false;
                this.innerContainer.cacheAsBitmap = true;
            }
            this.textContainer.update();
        };
        TextInput.prototype.updateClosestIndex = function (point, start) {
            var currentDistX = 99999;
            var currentIndex = -1;
            var atEnd = false;
            var closestLineIndex = 0;
            if (this.lineIndexMax > 0) {
                closestLineIndex = Math.max(0, Math.min(this.lineIndexMax, Math.floor(point.y / this.lineHeight)));
            }
            for (var i = 0; i < this.chars.length; i++) {
                var char = this.chars[i];
                if (char.lineIndex !== closestLineIndex) {
                    continue;
                }
                var distX = Math.abs(point.x - (char.x + (char.width * 0.5)));
                if (distX < currentDistX) {
                    currentDistX = distX;
                    currentIndex = i;
                    atEnd = point.x > char.x + (char.width * 0.5);
                }
            }
            if (start) {
                this.si = currentIndex;
                this.sie = atEnd;
            }
            else {
                this.ei = currentIndex;
                this.eie = atEnd;
            }
        };
        TextInput.prototype.deleteSelection = function () {
            if (this.hasSelection) {
                this.value = this.value.slice(0, this.selectionStart) + this.value.slice(this.selectionEnd + 1);
                this.setCaretIndex(this.selectionStart);
                return true;
            }
            return false;
        };
        TextInput.prototype.updateSelectionColors = function () {
            // Color charecters
            for (var i = 0; i < this.chars.length; i++) {
                if (i >= this.selectionStart && i <= this.selectionEnd) {
                    this.chars[i].style.fill = this.selectedColor;
                }
                else {
                    this.chars[i].style.fill = this.color;
                }
            }
        };
        TextInput.prototype.scrollToPosition = function (pos) {
            this._sp.x = pos.x;
            this._sp.y = pos.y;
            if (this.multiLine && this._sp.y >= this.lineHeight) {
                this._sp.y += this.lineHeight;
            }
            this.textContainer.focusPosition(this._sp);
        };
        TextInput.prototype.resetScrollPosition = function () {
            this._sp.set(0, 0);
            this.textContainer.focusPosition(this._sp);
        };
        TextInput.prototype.hideCaret = function () {
            this.caret.visible = false;
            clearInterval(this.caretInterval);
        };
        TextInput.prototype.showCaret = function () {
            var _this = this;
            this.clearSelection();
            clearInterval(this.caretInterval);
            this.caret.alpha = 1;
            this.caret.visible = true;
            this.caretInterval = setInterval(function () {
                _this.caret.alpha = _this.caret.alpha === 0 ? 1 : 0;
            }, 500);
        };
        TextInput.prototype.insertTextAtCaret = function (c) {
            if (!this.multiLine && c.indexOf('\n') !== -1) {
                c = c.replace(/\n/g, '');
            }
            if (this.hasSelection) {
                this.deleteSelection();
            }
            if (!this.maxLength || this.chars.length < this.maxLength) {
                if (this.caret._atEnd) {
                    this.valueEvent += c;
                    this.setCaretIndex(this.chars.length);
                }
                else {
                    var index = Math.min(this.chars.length - 1, this.caret._index);
                    this.valueEvent = this.value.slice(0, index) + c + this.value.slice(index);
                    this.setCaretIndex(index + c.length);
                }
            }
        };
        Object.defineProperty(TextInput.prototype, "valueEvent", {
            get: function () {
                return this._value;
            },
            set: function (val) {
                if (this.maxLength) {
                    val = val.slice(0, this.maxLength);
                }
                if (this._value != val) {
                    this.value = val;
                    this.emit('change');
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextInput.prototype, "value", {
            get: function () {
                return this._value;
            },
            set: function (val) {
                if (this.maxLength) {
                    val = val.slice(0, this.maxLength);
                }
                if (this._value != val) {
                    this._lastValue = this._value;
                    this._value = val;
                    this._dirtyText = true;
                    this.update();
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextInput.prototype, "text", {
            get: function () {
                return this.value;
            },
            set: function (value) {
                this.value = value;
            },
            enumerable: true,
            configurable: true
        });
        return TextInput;
    }(FocusableWidget));
    /*
     * Features:
     * multiLine, shift selection, Mouse Selection, Cut, Copy, Paste, Delete, Backspace, Arrow navigation, tabIndex
     *
     * Methods:
     * blur()
     * focus()
     * select() - selects all text
     * selectRange(startIndex, endIndex)
     * clearSelection()
     * setCaretIndex(index) moves caret to index
     *
     *
     * Events:
     * "change"
     * "blur"
     * "blur"
     * "focus"
     * "focusChanged" param: [bool]focus
     * "keyup" param: Event
     * "keydown" param: Event
     * "copy" param: Event
     * "paste" param: Event
     * "cut" param: Event
     * "keyup" param: Event
     */

    /**
     * An UI sprite object
     *
     * @class
     * @extends PIXI.UI.UIBase
     * @memberof PIXI.UI
     * @param Texture {PIXI.Texture} The texture for the sprite
     * @param [Width=Texture.width] {number} Width of tilingsprite
     * @param [Height=Texture.height] {number} Height of tiling sprite
     */
    var TilingSprite = /** @class */ (function (_super) {
        __extends(TilingSprite, _super);
        function TilingSprite(t, width, height) {
            var _this = this;
            var sprite = new PIXI$1.extras.TilingSprite(t);
            _this = _super.call(this, width || sprite.width, height || sprite.height) || this;
            _this.sprite = sprite;
            _this.contentContainer.addChild(_this.sprite);
            return _this;
        }
        /**
         * Updates the text
         *
         * @private
         */
        TilingSprite.prototype.update = function () {
            if (this.tint !== null) {
                this.sprite.tint = this.tint;
            }
            if (this.blendMode !== null) {
                this.sprite.blendMode = this.blendMode;
            }
            this.sprite.width = this._width;
            this.sprite.height = this._height;
        };
        Object.defineProperty(TilingSprite.prototype, "tilePosition", {
            get: function () {
                return this.sprite.tilePosition;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TilingSprite.prototype, "tilingPosition", {
            set: function (val) {
                this.sprite.tilePosition = val;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TilingSprite.prototype, "tileScale", {
            get: function () {
                return this.sprite.tileScale;
            },
            set: function (val) {
                this.sprite.tileScale = val;
            },
            enumerable: true,
            configurable: true
        });
        return TilingSprite;
    }(Widget));

    /**
     * `AnchorLayout` is used in conjunction with `AnchorLayoutOptions`.
     *
     * @memberof PUXI
     * @class
     * @example
     * ```
     * parent.useLayout(new PUXI.AnchorLayout());
     * ```
     */
    var AnchorLayout = /** @class */ (function () {
        function AnchorLayout() {
            this.noPercents = false;
        }
        AnchorLayout.prototype.onAttach = function (host) {
            this.host = host;
        };
        AnchorLayout.prototype.onDetach = function () {
            this.host = null;
        };
        AnchorLayout.prototype.measureChild = function (child, maxParentWidth, maxParentHeight, widthMode, heightMode) {
            var lopt = (child.layoutOptions || LayoutOptions.DEFAULT);
            var anchorLeft = lopt.anchorLeft || 0;
            var anchorTop = lopt.anchorTop || 0;
            var anchorRight = lopt.anchorRight || 0;
            var anchorBottom = lopt.anchorBottom || 0;
            var maxWidgetWidth = 0;
            var maxWidgetHeight = 0;
            var widgetWidthMode;
            var widgetHeightMode;
            // Widget width measurement
            if (this.noPercents || (Math.abs(anchorLeft) > 1 && Math.abs(anchorRight) > 1)) {
                maxWidgetWidth = Math.ceil(anchorRight) - Math.floor(anchorLeft);
                widgetWidthMode = exports.MeasureMode.AT_MOST;
            }
            else if (Math.abs(anchorLeft) < 1 && Math.abs(anchorRight) < 1) {
                maxWidgetWidth = maxParentWidth * (anchorRight - anchorLeft);
                widgetWidthMode = (widthMode === exports.MeasureMode.UNBOUNDED)
                    ? exports.MeasureMode.UNBOUNDED
                    : exports.MeasureMode.AT_MOST;
            }
            else if (Math.abs(anchorLeft) < 1) {
                maxWidgetWidth = anchorRight;
                widgetWidthMode = exports.MeasureMode.AT_MOST;
            }
            else {
                maxWidgetWidth = (maxParentWidth * anchorRight) - anchorLeft;
                widgetWidthMode = (widthMode === exports.MeasureMode.UNBOUNDED)
                    ? exports.MeasureMode.UNBOUNDED
                    : exports.MeasureMode.AT_MOST;
            }
            // Widget height measurement
            if (this.noPercents || (Math.abs(anchorTop) > 1 && Math.abs(anchorBottom) > 1)) {
                maxWidgetHeight = Math.ceil(anchorBottom) - Math.floor(anchorTop);
                widgetHeightMode = exports.MeasureMode.AT_MOST;
            }
            else if (Math.abs(anchorTop) < 1 && Math.abs(anchorBottom) < 1) {
                maxWidgetHeight = maxParentHeight * (anchorBottom - anchorTop);
                widgetHeightMode = (heightMode === exports.MeasureMode.UNBOUNDED)
                    ? exports.MeasureMode.UNBOUNDED
                    : exports.MeasureMode.AT_MOST;
            }
            else if (Math.abs(anchorTop) < 1) {
                maxWidgetHeight = anchorBottom;
                widgetHeightMode = exports.MeasureMode.AT_MOST;
            }
            else {
                maxWidgetHeight = (maxParentHeight * anchorBottom) - anchorTop;
                widgetHeightMode = (heightMode === exports.MeasureMode.UNBOUNDED)
                    ? exports.MeasureMode.UNBOUNDED
                    : exports.MeasureMode.AT_MOST;
            }
            child.measure(maxWidgetWidth, maxWidgetHeight, widgetWidthMode, widgetHeightMode);
        };
        AnchorLayout.prototype.measureStretch = function (lowerAnchor, upperAnchor, childDimen) {
            if (this.noPercents || (Math.abs(upperAnchor) > 1 && Math.abs(lowerAnchor) > 1)) {
                return Math.max(lowerAnchor, upperAnchor);
            }
            else if (Math.abs(lowerAnchor) < 1 && Math.abs(upperAnchor) < 1) {
                return childDimen / (upperAnchor - lowerAnchor);
            }
            else if (Math.abs(lowerAnchor) < 1) {
                return upperAnchor;
            }
            return (childDimen + lowerAnchor) / upperAnchor;
        };
        AnchorLayout.prototype.measureChildren = function (maxParentWidth, maxParentHeight, widthMode, heightMode) {
            var children = this.host.widgetChildren;
            for (var i = 0, j = children.length; i < j; i++) {
                this.measureChild(children[i], maxParentWidth, maxParentHeight, widthMode, heightMode);
            }
        };
        AnchorLayout.prototype.onMeasure = function (maxWidth, maxHeight, widthMode, heightMode) {
            if (widthMode === exports.MeasureMode.EXACTLY && heightMode === exports.MeasureMode.EXACTLY) {
                this.measuredWidth = maxWidth;
                this.measuredHeight = maxHeight;
                this.measureChildren(this.measuredWidth, this.measuredHeight, exports.MeasureMode.EXACTLY, exports.MeasureMode.EXACTLY);
            }
            var maxX = 0;
            var maxY = 0;
            var children = this.host.widgetChildren;
            this.measureChildren(maxWidth, maxHeight, widthMode, heightMode);
            for (var i = 0, j = children.length; i < j; i++) {
                var child = children[i];
                var lopt = (child.layoutOptions || LayoutOptions.DEFAULT);
                var anchorLeft = lopt.anchorLeft || 0;
                var anchorTop = lopt.anchorTop || 0;
                var anchorRight = lopt.anchorRight || 0;
                var anchorBottom = lopt.anchorBottom || 0;
                maxX = Math.max(maxX, this.measureStretch(anchorLeft, anchorRight, child.getMeasuredWidth()));
                maxY = Math.max(maxY, this.measureStretch(anchorTop, anchorBottom, child.getMeasuredHeight()));
            }
            if (widthMode === exports.MeasureMode.EXACTLY) {
                this.measuredWidth = maxWidth;
            }
            else if (widthMode === exports.MeasureMode.AT_MOST) {
                this.measuredWidth = Math.min(maxX, maxWidth);
            }
            else {
                this.measuredWidth = maxX;
            }
            if (heightMode === exports.MeasureMode.EXACTLY) {
                this.measuredHeight = maxHeight;
            }
            else if (heightMode === exports.MeasureMode.AT_MOST) {
                this.measuredHeight = Math.min(maxY, maxHeight);
            }
            else {
                this.measuredHeight = maxY;
            }
            this.measureChildren(this.measuredWidth, this.measuredHeight, exports.MeasureMode.EXACTLY, exports.MeasureMode.EXACTLY);
        };
        AnchorLayout.prototype.getMeasuredWidth = function () {
            return this.measuredWidth;
        };
        AnchorLayout.prototype.getMeasuredHeight = function () {
            return this.measuredHeight;
        };
        AnchorLayout.prototype.onLayout = function () {
            var parent = this.host;
            var widgetChildren = parent.widgetChildren;
            for (var i = 0; i < widgetChildren.length; i++) {
                var child = widgetChildren[i];
                var layoutOptions = (child.layoutOptions || {});
                var childWidth = child.measuredWidth;
                var childHeight = child.measuredHeight;
                var anchorLeft = layoutOptions.anchorLeft || 0;
                var anchorTop = layoutOptions.anchorTop || 0;
                var anchorRight = layoutOptions.anchorRight || 0;
                var anchorBottom = layoutOptions.anchorBottom || 0;
                if (anchorLeft > -1 && anchorLeft <= 1) {
                    anchorLeft *= parent.width;
                }
                if (anchorTop > -1 && anchorTop <= 1) {
                    anchorTop *= parent.height;
                }
                if (anchorRight > -1 && anchorRight <= 1) {
                    anchorRight *= parent.width;
                }
                if (anchorBottom > -1 && anchorBottom <= 1) {
                    anchorBottom *= parent.height;
                }
                var x = 0;
                var y = 0;
                if (childWidth !== 0) {
                    switch (layoutOptions.horizontalAlign || exports.ALIGN.NONE) {
                        case exports.ALIGN.LEFT:
                            x = anchorLeft;
                            break;
                        case exports.ALIGN.MIDDLE:
                            x = (anchorRight - anchorLeft - childWidth) / 2;
                            break;
                        case exports.ALIGN.RIGHT:
                            x = anchorRight - childWidth;
                            break;
                    }
                }
                else {
                    x = anchorLeft;
                    childWidth = anchorRight - anchorLeft;
                }
                if (childHeight !== 0) {
                    switch (layoutOptions.verticalAlign || exports.ALIGN.NONE) {
                        case exports.ALIGN.TOP:
                            y = anchorTop;
                            break;
                        case exports.ALIGN.MIDDLE:
                            y = (anchorBottom - anchorTop - childHeight) / 2;
                            break;
                        case exports.ALIGN.RIGHT:
                            y = anchorBottom - childWidth;
                            break;
                    }
                }
                else {
                    y = anchorRight;
                    childHeight = anchorBottom - anchorTop;
                }
                child.layout(x, y, x + childWidth, y + childHeight);
            }
        };
        return AnchorLayout;
    }());

    exports.AnchorLayout = AnchorLayout;
    exports.AnchorLayoutOptions = AnchorLayoutOptions;
    exports.Button = Button;
    exports.CheckBox = CheckBox;
    exports.ClickManager = ClickManager;
    exports.DynamicText = DynamicText;
    exports.DynamicTextStyle = DynamicTextStyle;
    exports.Ease = Ease;
    exports.EventBroker = EventBroker;
    exports.EventManager = EventManager;
    exports.FastLayout = FastLayout;
    exports.FastLayoutOptions = FastLayoutOptions;
    exports.Helpers = Helpers;
    exports.Insets = Insets;
    exports.InteractiveGroup = InteractiveGroup;
    exports.LayoutOptions = LayoutOptions;
    exports.ScrollBar = ScrollBar;
    exports.ScrollManager = ScrollManager;
    exports.ScrollWidget = ScrollWidget;
    exports.SliceSprite = SliceSprite;
    exports.Slider = Slider;
    exports.SortableList = SortableList;
    exports.Sprite = Sprite;
    exports.Stage = Stage;
    exports.TextInput = TextInput;
    exports.TextWidget = TextWidget;
    exports.Ticker = Ticker;
    exports.TilingSprite = TilingSprite;
    exports.Tween = Tween;
    exports.Widget = Widget;
    exports.WidgetGroup = WidgetGroup;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=pixi-ui.js.map
