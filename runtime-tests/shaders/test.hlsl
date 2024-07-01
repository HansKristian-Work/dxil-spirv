RWStructuredBuffer<uint> RWBuf0 : register(u1);
RWStructuredBuffer<uint> RWBuf1 : register(u2);

struct Payload
{
	uint grid : SV_DispatchGrid;
	uint offset;
	uint increment;
};

struct EntryData
{
	uint node_idx;
	uint size;
	uint offset;
	uint increment;
};

[Shader("node")]
[NodeLaunch("broadcasting")]
[NumThreads(8, 1, 1)]
[NodeDispatchGrid(2, 2, 2)]
[NodeIsProgramEntry]
void entry(DispatchNodeInputRecord<EntryData> entry,
		uint3 thr : SV_DispatchThreadID,
		uint local_id : SV_GroupIndex,
		[MaxRecords(8)] [NodeID("Broadcast0")] NodeOutput<Payload> opayload0,
		[MaxRecords(8)] [NodeID("Broadcast1")] NodeOutput<Payload> opayload1)
{
	uint linear_thr = thr.x + thr.y * 16 + thr.z * 32;
	if (entry.Get().node_idx != 0)
	{
		GroupNodeOutputRecords<Payload> write1 = opayload1.GetGroupNodeOutputRecords(8);
		write1.Get(local_id).grid = entry.Get().size;
		write1.Get(local_id).offset = entry.Get().offset + linear_thr;
		write1.Get(local_id).increment = entry.Get().increment;
		write1.OutputComplete();
	}
	else
	{
		ThreadNodeOutputRecords<Payload> write0 = opayload0.GetThreadNodeOutputRecords(1);
		write0.Get().grid = entry.Get().size;
		write0.Get().offset = entry.Get().offset + linear_thr;
		write0.Get().increment = entry.Get().increment;
		write0.OutputComplete();
	}
}

[Shader("node")]
[NodeLaunch("broadcasting")]
[NumThreads(8, 1, 1)]
[NodeMaxDispatchGrid(4, 1, 1)]
void node1(DispatchNodeInputRecord<Payload> entry,
		uint thr : SV_DispatchThreadID,
		uint local_id : SV_GroupIndex,
		uint group_id : SV_GroupID,
		[MaxRecords(64)] [NodeArraySize(8)] [NodeID("Broadcast0")] NodeOutputArray<Payload> opayload0,
		[MaxRecords(64)] [NodeID("Broadcast1")] NodeOutput<Payload> opayload)
{
	uint o;
	InterlockedAdd(RWBuf0[entry.Get().offset], entry.Get().increment, o);
}

[Shader("node")]
[NodeLaunch("broadcasting")]
[NumThreads(8, 1, 1)]
[NodeMaxDispatchGrid(4, 1, 1)]
void node2(DispatchNodeInputRecord<Payload> entry,
		uint thr : SV_DispatchThreadID,
		uint local_id : SV_GroupIndex,
		uint group_id : SV_GroupID)
{
	uint o;
	InterlockedAdd(RWBuf1[entry.Get().offset], entry.Get().increment, o);
}

