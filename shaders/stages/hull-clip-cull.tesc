struct VSControlPoint
{
	float2 clip_value : SV_ClipDistance;
	float cull_value[2] : SV_CullDistance;
};

struct HSControlPoint
{
	float2 value : HSValue;
	float2 clip_value : SV_ClipDistance;
	float cull_value[2] : SV_CullDistance;
};

struct PatchConstant
{
	float outer[4] : SV_TessFactor;
	float inner[2] : SV_InsideTessFactor;
};

[domain("quad")]
[partitioning("integer")]
[outputtopology("triangle_cw")]
[outputcontrolpoints(4)]
[patchconstantfunc("main_patch")]
HSControlPoint main(InputPatch<VSControlPoint, 4> ip, uint control : SV_OutputControlPointID)
{
	HSControlPoint cp;
	cp.value = ip[control].clip_value + ip[control].cull_value[0] + ip[control].cull_value[1];
	cp.clip_value = float2(1, 2);
	cp.cull_value[0] = 3.0;
	cp.cull_value[1] = 4.0;
	return cp;
}

PatchConstant main_patch(OutputPatch<HSControlPoint, 4> op, InputPatch<VSControlPoint, 4> ip)
{
	PatchConstant pc = (PatchConstant)0;
	return pc;
}
