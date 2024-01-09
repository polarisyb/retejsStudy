import { createRoot } from "react-dom/client";
import { NodeEditor, GetSchemes, ClassicPreset } from "rete";
import { AreaPlugin, AreaExtensions } from "rete-area-plugin";
import {
  ConnectionPlugin,
  Presets as ConnectionPresets
} from "rete-connection-plugin";
import { ReactPlugin, Presets, ReactArea2D } from "rete-react-plugin";

type Schemes = GetSchemes<
  ClassicPreset.Node,
  ClassicPreset.Connection<ClassicPreset.Node, ClassicPreset.Node>
>;
type AreaExtra = ReactArea2D<Schemes>;

// createEditor

export async function createEditor(container: HTMLElement) {

  // ClassicPreset
  // Node, Socket, Control, Input, Output, Connection 등을 정의한다.

  // socket
  // socket은 노드의 입출력을 정의한다.
  const socket = new ClassicPreset.Socket("socket");

  // editor
  // editor는 노드와 연결을 관리하고 생성하는 시작점이다.
  const editor = new NodeEditor<Schemes>();

  // area
  // area는 editor의 확장이다.
  // editor는 area를 통해 노드를 배치하고 연결할 수 있다.
  const area = new AreaPlugin<Schemes, AreaExtra>(container);

  // connection
  // connection은 editor의 확장이다.
  // editor는 connection을 통해 노드를 연결할 수 있다.
  const connection = new ConnectionPlugin<Schemes, AreaExtra>();
  const render = new ReactPlugin<Schemes, AreaExtra>({ createRoot });

  AreaExtensions.selectableNodes(area, AreaExtensions.selector(), {
    accumulating: AreaExtensions.accumulateOnCtrl()
  });

  render.addPreset(Presets.classic.setup());

  connection.addPreset(ConnectionPresets.classic.setup());

  // area는 editor의 확장이기 때문에 editor에 등록해야 한다.
  editor.use(area);

  // connection은 editor의 확장이기 때문에 editor에 등록해야 한다.
  area.use(connection);
  area.use(render);

  AreaExtensions.simpleNodesOrder(area);

  const a = new ClassicPreset.Node("A");
  a.addControl("a", new ClassicPreset.InputControl("text", { initial: "a" }));
  a.addOutput("a", new ClassicPreset.Output(socket));
  await editor.addNode(a);

  const b = new ClassicPreset.Node("B");
  b.addControl("b", new ClassicPreset.InputControl("text", { initial: "b" }));
  b.addInput("b", new ClassicPreset.Input(socket));
  await editor.addNode(b);

  const c = new ClassicPreset.Node("C");
  c.addControl("c", new ClassicPreset.InputControl("number", { initial: 5 }));
  c.addInput("c", new ClassicPreset.Input(socket));
  await editor.addNode(c);

  await editor.addConnection(new ClassicPreset.Connection(a, "a", b, "b"));
  await editor.addConnection(new ClassicPreset.Connection(a, "a", c, "c"));

  // translate
  // node의 위치를 이동시키는 함수
  // await area.translate(editor.nodes[0].id, { x: 0, y: 0 });
  await area.translate(a.id, { x: 0, y: 0 });
  await area.translate(b.id, { x: 270, y: 0 });
  await area.translate(c.id, { x: 270, y: 150 });

  setTimeout(() => {
    // wait until nodes rendered because they dont have predefined width and height

    // zoomAt
    // editor의 zoom을 조정하는 함수
    AreaExtensions.zoomAt(area, editor.getNodes());
  }, 10);
  return {
    destroy: () => area.destroy()
  };
}
