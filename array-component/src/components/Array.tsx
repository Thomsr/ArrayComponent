import { Layout, LayoutProps, Node, Rect, ShapeProps, Text } from "@motion-canvas/2d/lib/components";
import { easeInOutCubic, tween } from "@motion-canvas/core/lib/tweening"
import { Color } from "@motion-canvas/core/lib/types/Color"
import { initial, signal } from "@motion-canvas/2d/lib/decorators";
import { SignalValue, SimpleSignal } from "@motion-canvas/core/lib/signals";
import { ColorSignal, Spacing } from "@motion-canvas/core/lib/types";
import { makeRef } from "@motion-canvas/core/lib/utils";
import { range } from '@motion-canvas/core/lib/utils';
// import { Colors, BlackLabel, WhiteLabel } from "../styles";

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
    
    private getValue(Index: number){
        if(this.values()[Index] == undefined){
            return -1;
        }
        return this.values()[Index];
    }

    public readonly boxArray: Rect[] = [];
    public pool = range(10).map(i => (
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
                // text={() => this.values().length.toString()}
                {...this.textStyle}
            />
        </Rect>
    ));

    textStyle = {
        paddingTop: 10,
        fontFamily: 'JetBrains Mono',
        fill: 'rgba(255, 255, 255, 0.6)',
    };

    public constructor(props?: ArrayProps) {
        super({
            ...props
        }); 

        this.add(
            <Node
                spawner={() => this.pool.slice(0, this.values().length)}
            >
                
            </Node>
        )
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

    public * deHighLight(Index: number, Duration: number, highlightColor: Color){
        yield* tween(Duration, color =>{
            this.boxArray[Index].stroke(
                Color.lerp(
                    new Color(highlightColor), 
                    new Color('#242424'),
                    easeInOutCubic(color),
                )
            )
        })
    }

    public * Swap(){

    }
}

