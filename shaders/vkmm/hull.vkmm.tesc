struct VSControlPoint
{
	float value : VSValue;
};

struct HSControlPoint
{
	float value : HSValue;
};

struct PatchConstant
{
	float outer[4] : SV_TessFactor;
	float inner[2] : SV_InsideTessFactor;
	float patch : PATCH;
};

cbuffer Cbuf : register(b0)
{
	float global_constant;
};

[domain("quad")]
[partitioning("integer")]
[outputtopology("triangle_cw")]
[outputcontrolpoints(4)]
[patchconstantfunc("main_patch")]
HSControlPoint main(InputPatch<VSControlPoint, 5> ip, uint control : SV_OutputControlPointID)
{
	// Test that alloca gets directly appropriately.
	float4 v;
	v.x = ip[0].value;
	v.y = ip[1].value;
	v.z = ip[2].value;
	v.w = ip[3].value;
	v[int(ip[0].value)] += 40.0;

	HSControlPoint cp;
	cp.value = ip[0].value + ip[1].value + ip[2].value + v[3] + float(control);
	return cp;
}

PatchConstant main_patch(OutputPatch<HSControlPoint, 4> op, InputPatch<VSControlPoint, 5> ip)
{
	// Test that alloca gets directly appropriately.
	float4 v;
	v.x = ip[0].value;
	v.y = ip[1].value;
	v.z = ip[2].value;
	v.w = ip[3].value;
	v[int(ip[0].value)] += 40.0;

	PatchConstant pc;
	pc.inner[0] = op[0].value;
	pc.inner[1] = op[1].value;
	pc.outer[0] = ip[0].value;
	pc.outer[1] = ip[1].value;
	pc.outer[2] = ip[2].value;
	pc.outer[3] = ip[0].value + op[0].value;
	pc.patch = v[3] + global_constant;
	return pc;
}
