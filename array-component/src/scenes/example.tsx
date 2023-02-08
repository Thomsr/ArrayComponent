import {makeScene2D} from '@motion-canvas/2d/lib/scenes';
import {waitFor} from '@motion-canvas/core/lib/flow';
import { Color } from '@motion-canvas/core/lib/types';
import { createRef } from '@motion-canvas/core/lib/utils';
import {Array} from '../components/Array'

export default makeScene2D(function* (view) {
  // Create your animations here

  const Array1 = [1, 2]
  const ArrayRef = createRef<Array>();

  view.add(
    <Array
      ref={ArrayRef}  
      values={[0,1,2,3]}
    />
  )

  yield* ArrayRef().HighLight(0, 1, new Color('#2196f3'));
  yield* ArrayRef().deHighLight(0, 1, new Color('#2196f3'));

  yield* waitFor(5);
});
