Texture2D<half4> Tex : register(t0);
Texture2D<int16_t4> TexI16 : register(t1);
Texture2D<uint16_t4> TexU16 : register(t2);
SamplerState S : register(s0);
SamplerComparisonState SComp : register(s1);

Buffer<half4> Buf : register(t3);
Buffer<int16_t4> BufI16 : register(t4);
Buffer<uint16_t4> BufU16 : register(t5);

struct FOut
{
	half4 f16 : SV_Target0;
	int16_t4 i16 : SV_Target1;
	uint16_t4 u16 : SV_Target2;
	uint codes : SV_Target3;
};

FOut main(float2 uv : UV)
{
	uint code;

	FOut fout;
	fout.codes = 0;
	fout.f16 = Tex.Sample(S, uv, int2(0, 0), 0.0, code); fout.codes |= code;
	fout.i16 = TexI16.Load(int3(1, 2, 3), int2(0, 0), code); fout.codes |= code;
	fout.u16 = TexU16.Load(int3(4, 5, 6), int2(0, 0), code); fout.codes |= code;

	fout.f16 += Tex.GatherRed(S, uv, int2(0, 0), code); fout.codes |= code;
	fout.i16 += TexI16.GatherGreen(S, uv, int2(0, 0), code); fout.codes |= code;
	fout.u16 += TexU16.GatherBlue(S, uv, int2(0, 0), code); fout.codes |= code;

	fout.f16 += Tex.SampleCmp(SComp, uv, 0.5, int2(0, 0), 0.0, code).x; fout.codes |= code;
	fout.f16 += Tex.SampleCmpLevelZero(SComp, uv, 0.5, int2(0, 0), code).x; fout.codes |= code;
	fout.f16 += Tex.GatherCmp(SComp, uv, 0.5, int2(0, 0), code); fout.codes |= code;

	fout.f16 += Tex.SampleLevel(S, uv, 0.0, int2(0, 0), code); fout.codes |= code;
	fout.f16 += Tex.SampleGrad(S, uv, float2(0.2, 0.3), float2(0.4, 0.5), int2(0, 0), 0.0, code); fout.codes |= code;
	fout.f16 += Tex.SampleBias(S, uv, 0.5, int2(0, 0), 0.0, code); fout.codes |= code;

	fout.f16 += Buf.Load(int(uv.x), code); fout.codes |= code;
	fout.i16 += BufI16.Load(int(uv.x), code); fout.codes |= code;
	fout.u16 += BufU16.Load(int(uv.x), code); fout.codes |= code;

	return fout;
}
