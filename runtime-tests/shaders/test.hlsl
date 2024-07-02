RWStructuredBuffer<uint> RWBuf0 : register(u1);
RWStructuredBuffer<uint> RWBuf1 : register(u2);

struct [NodeTrackRWInputSharing] Payload
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

#if 1
[Shader("node")]
[NodeLaunch("broadcasting")]
[NumThreads(8, 1, 1)]
[NodeMaxDispatchGrid(4, 1, 1)]
void node1(RWDispatchNodeInputRecord<Payload> entry,
		uint thr : SV_DispatchThreadID,
		uint local_id : SV_GroupIndex,
		uint group_id : SV_GroupID)
{
	uint o;
	if (entry.FinishedCrossGroupSharing())
		InterlockedAdd(RWBuf0[0], entry.Get().increment, o);
	InterlockedAdd(RWBuf0[2], entry.Get().increment, o);
}

[Shader("node")]
[NodeLaunch("broadcasting")]
[NumThreads(8, 1, 1)]
[NodeMaxDispatchGrid(4, 1, 1)]
void node2(RWDispatchNodeInputRecord<Payload> entry,
		uint thr : SV_DispatchThreadID,
		uint local_id : SV_GroupIndex,
		uint group_id : SV_GroupID)
{
	uint o;
	if (entry.FinishedCrossGroupSharing())
		InterlockedAdd(RWBuf1[1], entry.Get().increment, o);
	InterlockedAdd(RWBuf1[3], entry.Get().increment, o);
}
#else
[Shader("node")]
[NodeLaunch("coalescing")]
[NumThreads(3, 1, 1)]
void node1([MaxRecords(3)] GroupNodeInputRecords<Payload> entry, uint lid : SV_GroupIndex)
{
	if (lid < entry.Count())
	{
		uint o;
		//InterlockedAdd(RWBuf0[entry.Get(lid).offset], entry.Get(lid).increment, o);
		InterlockedAdd(RWBuf0[0], 1, o);
	}
}

[Shader("node")]
[NodeLaunch("coalescing")]
[NumThreads(3, 1, 1)]
void node2([MaxRecords(3)] GroupNodeInputRecords<Payload> entry, uint lid : SV_GroupIndex)
{
	if (lid < entry.Count())
	{
		uint o;
		//InterlockedAdd(RWBuf1[entry.Get(lid).offset], entry.Get(lid).increment, o);
		InterlockedAdd(RWBuf1[1], 1, o);
	}
}
#endif

