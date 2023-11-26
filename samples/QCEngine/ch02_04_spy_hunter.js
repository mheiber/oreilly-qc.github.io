// Programming Quantum Computers
//   by Eric Johnston, Nic Harrigan and Mercedes Gimeno-Segovia
//   O'Reilly Media

// To run this online, go to http://oreilly-qc.github.io?p=2-4

// use classical pseudo-randomness to distinguish what is truly quantum here
function randBool() {
    return Math.random() < .5;
}
function randBit() {
    return +randBool();

}

function spy(fiber) {
    const spyShouldApplyHad = randBool();
    qc.nop();
    qc.label('spy');
    if (spyShouldApplyHad) {
        fiber.had();
    }
    const _stolenData = fiber.read();
    fiber.write(stolen_data);
    if (spyShouldApplyHad) {
        fiber.had();
    }
    qc.label('');
    qc.nop();
}

function transact() {
    qc.reset(3);
    qc.discard();
    const a = qint.new(1, 'alice');
    const fiber = qint.new(1, 'fiber');
    const b = qint.new(1, 'bob');

    qc.label('get two random bits');
    const shouldSendHad = randBool();
    const sendValue = randBit();
    qc.label('');

    // Prepare Alice's qubit
    a.write(0);
    qc.label('set value');
    qc.nop();
    if (sendValue) {
        a.not();
    }
    qc.nop();
    qc.label('');
    qc.nop();
    qc.label('apply had');
    qc.nop();
    if (shouldSendHad) {
        a.had();
    }
    qc.nop();
    qc.label('');

    // Send the qubit!
    fiber.exchange(a);

    spy(fiber);

    // Receive the qubit!
    let shouldReceiveHad = randBool();
    fiber.exchange(b);
    qc.label('apply had');
    qc.nop();
    if (shouldReceiveHad) {
        b.had();
    }
    qc.nop();
    qc.label('');
    qc.nop();
    qc.label('read value');
    qc.nop();
    shouldReceiveVal = b.read();
    qc.nop();
    qc.label('');
    qc.nop();

    // Now Alice emails Bob to tell
    // him her had setting and value.
    // If the had setting matches and the
    // value does not, there's a spy!
    return shouldSendHad === shouldReceiveHad && sendValue !== shouldReceiveVal
}

function main() {
    const min_samples = 2000;
    const spy_is_present = true;
    let caught_count = 0;
    let sample_count = 1;
    for (;; sample_count++) {
        const caught = transact();
        caught_count += +caught;
        if (sample_count >= min_samples && caught) {
            // stop so we can see 
            break;
        }
    }
    qc.print(`${caught_count / sample_count * 100}% caught = ${caught_count} / ${sample_count}`)
}
main();

