module.exports = function (RED) {
  function RDLAPIMakerCTANode(config) {
    RED.nodes.createNode(this, config);
    const node = this;

    node.machineCode = (config.machineCode || "").trim();
    node.topic = (config.topic || "").trim();

    node.on("input", function (msg, send, done) {
      try {
        send = send || function () { node.send.apply(node, arguments); };

        const counter = msg.payload;

        // (Opsional) validasi basic: counter harus number atau string angka
        // kalau kamu mau super strict, uncomment bagian ini:
        // const n = Number(counter);
        // if (Number.isNaN(n)) {
        //   node.status({ fill: "red", shape: "dot", text: "payload bukan angka" });
        //   msg.payload = { error: "payload bukan angka", received: counter };
        //   send(msg);
        //   done && done();
        //   return;
        // }

        const isoTimestamp = new Date().toISOString();

        const oee = {
          machineID: node.machineCode,
          quantity: counter,
          timestamp: isoTimestamp
        };

        msg.topic = node.topic;
        msg.payload = oee;

        node.status({
          fill: "green",
          shape: "dot",
          text: `OK ${node.machineCode || "-"}`
        });

        send(msg);
        done && done();
      } catch (err) {
        node.status({ fill: "red", shape: "ring", text: "error" });
        done ? done(err) : node.error(err, msg);
      }
    });
  }

  RED.nodes.registerType("rdl-api-maker-cta", RDLAPIMakerCTANode);
};
