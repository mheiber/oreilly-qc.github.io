// Programming Quantum Computers
//   by Eric Johnston, Nic Harrigan and Mercedes Gimeno-Segovia
//   O'Reilly Media

// To run this online, go to http://oreilly-qc.github.io?p=10-1
qc_options.color_by_phase = true;

var num_qubits = 3;
var num_ancilla = 1;

function main()
{
    qc.reset(num_qubits+num_ancilla);
    //var reg = qint.new(num_qubits, 'reg');
    var a = qint.new(1, 'a');
    var b = qint.new(1, 'b');
    var c = qint.new(1, 'c');
    var ancilla = qint.new(1, 'ancilla');
    
    qc.write(0);
    qc.hadamard(0x1|0x2|0x4);

    qc.codeLabel('(a OR NOT b)');
    b.not();
    bit_or(1,2,8);
    qc.codeLabel('');
    qc.nop();
    
    
    qc.codeLabel('pAND')
    phase_and(4|8);
    qc.codeLabel('');
    
    qc.nop();
    qc.codeLabel('uncompute');
    inv_bit_or(1,2,8);
    b.not();
    qc.codeLabel('');
}

//////////// Definitions

//Define bit OR and inverse
function bit_or(q1,q2,out)
{
    qc.not(q1|q2);
    qc.cnot(out,q1|q2);
    qc.not(q1|q2|out);
}

function inv_bit_or(q1,q2,out)
{
    qc.not(q1|q2|out);
    qc.cnot(out,q1|q2);
    qc.not(q1|q2);
}


// Define phase AND (pAND)
function phase_and(qubits)
{
    qc.cz(qubits);
}

main();


