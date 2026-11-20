// @ts-nocheck
import { customTicker, customTimers } from "../customGuard.ts";
const __mk = customTicker("CalendarioDataAtto");
const { setTimeout, setInterval, clearTimeout, clearInterval } = customTimers("CalendarioDataAtto");
import { useState } from "react";
import { Button, Card, Dialog, Select, TextInput, useTable, usePrototype } from "../floware";

function mostraData(valore) {__mk();
  const parti = valore.split("-");
  return parti.length === 3 ? parti[2] + "/" + parti[1] + "/" + parti[0] : valore;
}

export default function CalendarioDataAtto(props) {__mk();
  const table = useTable("date-atti");
  const { notify } = usePrototype();
  const [atto, setAtto] = useState("");
  const [aperto, setAperto] = useState(false);
  const [bozza, setBozza] = useState("");
  if (!table || table.column("Atto") < 0 || table.column("Data dell’atto") < 0) return <p>Registro delle date non disponibile.</p>;
  const nomi = table.rows.map((r) => (__mk(), table.value(r, "Atto")));
  const indice = atto ? table.findRows("Atto", atto)[0] : -1;
  const valido = indice !== undefined && indice >= 0;
  const salvata = valido ? table.value(indice, "Data dell’atto") : "";
  function apri() {__mk();
    setBozza(salvata);
    setAperto(true);
  }
  function conferma() {__mk();
    if (!valido || !bozza) return;
    table.setCell(indice, "Data dell’atto", bozza);
    setAperto(false);
    notify("Data associata all’atto selezionato.");
  }
  return (
    <Card title="Data dell’atto">
      <div className="space-y-3">
        <p className="text-sm text-(--mk-muted)">Scegli lo stesso atto che stai controllando. Questa selezione è indipendente dall’esempio della lista di controllo.</p>
        <Select label="Atto da collegare" value={atto} options={["", ...nomi]} onChange={setAtto} />
        <p>Data confermata: <strong>{salvata ? mostraData(salvata) : "Non impostata"}</strong></p>
        <Button disabled={!valido} onClick={apri}>{salvata ? "Modifica data" : "Scegli data"}</Button>
      </div>
      {aperto && <Dialog title="Seleziona la data dell’atto" onClose={() => (__mk(), setAperto(false))} footer={<><Button variant="secondary" onClick={() => (__mk(), setAperto(false))}>Annulla</Button><Button disabled={!bozza || !valido} onClick={conferma}>Conferma data</Button></>}>
        <div className="space-y-4">
          <p className="font-medium">{atto}</p>
          <TextInput label="Data dell’atto" type="date" value={bozza} onChange={setBozza} />
          <p>Data selezionata: <strong>{bozza ? mostraData(bozza) : "Nessuna"}</strong></p>
          <p className="text-sm text-(--mk-muted)">La data viene associata all’atto solo dopo la conferma. Il testo della determinazione non viene modificato.</p>
        </div>
      </Dialog>}
    </Card>
  );
}
