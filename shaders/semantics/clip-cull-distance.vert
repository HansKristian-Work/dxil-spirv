struct VSOut
{
	float4 pos : SV_Position;
	float4 clip : SV_ClipDistance;
	float4 cull : SV_CullDistance;
};

VSOut main(float4 pos : POS, float4 clip : CLIP, float4 cull : CULL)
{
	VSOut vs;
	vs.pos = pos;
	vs.clip = clip;
	vs.cull = cull;
	return vs;
}
