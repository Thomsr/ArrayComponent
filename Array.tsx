import { Layout, LayoutProps, Node, Rect, ShapeProps, Text } from "@motion-canvas/2d/lib/components";
import { easeInOutCubic, tween } from "@motion-canvas/core/lib/tweening"
import { Color } from "@motion-canvas/core/lib/types/Color"
import { initial, signal } from "@motion-canvas/2d/lib/decorators";
import { SignalValue, SimpleSignal } from "@motion-canvas/core/lib/signals";
import { Spacing } from "@motion-canvas/core/lib/types";
import { makeRef } from "@motion-canvas/core/lib/utils";
import { range } from '@motion-canvas/core/lib/utils';
import { all } from "@motion-canvas/core/lib/flow"

export interface ArrayProps extends ShapeProps, LayoutProps {
    values?: SignalValue<number[] | string[] >;
    boxWidth?: SignalValue<number>;
    boxHeight?: SignalValue<number>;
    boxGap?: SignalValue<number>;
}

export class Array extends Layout {
    @initial([])
    @signal()
    public declare readonly values: SimpleSignal<number[] | string[], this>

    @initial(128)
    @signal()
    public declare readonly boxWidth: SimpleSignal<number, this>

    @initial(128)
    @signal()
    public declare readonly boxHeight: SimpleSignal<number, this>

    @initial(28)
    @signal()
    public declare readonly boxGap: SimpleSignal<number, this>

    // Array that stores the references to the Rects
    public readonly boxArray: Rect[] = [];
    private highlightColor: Color;
    
    textStyle = {
        paddingTop: 10,
        fontFamily: 'JetBrains Mono',
        fill: 'rgba(255, 255, 255, 0.6)',
    };

    // @brief Returns value of the original array
    public getValue(Index: number){
        if(this.values()[Index] == undefined){
            return -1;
        }
        return this.values()[Index];
    }
    
    // @brief Pool to reduce playback lag in the animator
    public pool = range(64).map(i => (
        <Rect
            ref={makeRef(this.boxArray, i)}
            size={[this.boxWidth(), this.boxWidth()]}
            x={-((this.values().length * (this.boxWidth() + this.boxGap())) / 2) + i * (this.boxWidth() + this.boxGap()) + (this.boxWidth() + this.boxGap()) / 2}
            lineWidth={8}
            stroke={'#242424'}
            radius={new Spacing(4)}
        >
            <Text
                text={this.getValue(i).toString()}
                {...this.textStyle}
            />
        </Rect>
    ));


    public constructor(props?: ArrayProps) {
        super({
            spawner: () => this.pool.slice(0, this.values().length),
            ...props
        }); 
    }

    public * HighLight(Index: number, Duration: number, highlightColor: Color){
        yield* tween(Duration, color =>{
            this.boxArray[Index].stroke(
                Color.lerp(
                    new Color('#242424'),
                    new Color(highlightColor), 
                    easeInOutCubic(color),
                )
            )
        })
    }

    public * deHighLight(Index: number, Duration: number){
        yield* tween(Duration, color => {
            this.boxArray[Index].stroke(
                Color.lerp(
                    new Color('#2196f3'), 
                    new Color('#242424'),
                    easeInOutCubic(color),
                )
            )
        })
    }

    // @param {Boolean} Direction Left == false, Right == True
    public * Swap(Index1: number, Index2: number, Direction: boolean, Duration: number){
        if(Direction) this.boxArray[Index1].moveUp();
        yield* all(
            this.boxArray[Index1].position(this.boxArray[Index2].position(), Duration),
            this.boxArray[Index2].position(this.boxArray[Index1].position(), Duration),
        )
        if(!Direction) this.boxArray[Index2].moveDown();
        let tempValue = this.boxArray[Index1];
        this.boxArray[Index1] = this.boxArray[Index2];
        this.boxArray[Index2] = tempValue;

        let tempValue1 = this.values()[Index1];
        this.values()[Index1] = this.values()[Index2];
        this.values()[Index2] = tempValue1;
     }
}
