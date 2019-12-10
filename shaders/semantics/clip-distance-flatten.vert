struct VSOut
{
	float4 pos : SV_Position;
	float2 clip[2] : SV_ClipDistance;
};

VSOut main(float4 pos : POS, float2 clip : CLIP)
{
	VSOut vs;
	vs.pos = pos;
	vs.clip[0] = clip;
	vs.clip[1] = clip + 1.0;
	return vs;
}
