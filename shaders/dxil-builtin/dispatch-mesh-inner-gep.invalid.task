struct Payload
{
	uint value;
};

groupshared Payload g_payloads[2];

[numthreads(2, 1, 1)]
void main(uint t : SV_GroupIndex)
{
	g_payloads[t].value = t;
	GroupMemoryBarrierWithGroupSync();
	DispatchMesh(1, 1, 1, g_payloads[1]);
}
