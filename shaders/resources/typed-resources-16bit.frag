Texture2D<half4> Tex : register(t0);
Texture2D<int16_t4> TexI16 : register(t1);
Texture2D<uint16_t4> TexU16 : register(t2);
SamplerState S : register(s0);
SamplerComparisonState SComp : register(s1);

RWTexture2D<half4> RWTex : register(u0);
RWTexture2D<int16_t4> RWTexI16 : register(u1);
RWTexture2D<uint16_t4> RWTexU16 : register(u2);

Buffer<half4> Buf : register(t3);
Buffer<int16_t4> BufI16 : register(t4);
Buffer<uint16_t4> BufU16 : register(t5);

RWBuffer<half4> RWBuf : register(u3);
RWBuffer<int16_t4> RWBufI16 : register(u4);
RWBuffer<uint16_t4> RWBufU16 : register(u5);

struct FOut
{
	half4 f16 : SV_Target0;
	int16_t4 i16 : SV_Target1;
	uint16_t4 u16 : SV_Target2;
};

FOut main(float2 uv : UV)
{
	RWTex[int2(uv)] = half4(uv.xyxy);
	RWTexI16[int2(uv)] = int16_t4(uv.xyxy);
	RWTexU16[int2(uv)] = uint16_t4(uv.xyxy);

	RWBuf[int(uv.x)] = half(8.0);
	RWBufI16[int(uv.x)] = int16_t(-20);
	RWBufU16[int(uv.x)] = uint16_t(80);

	FOut fout;
	fout.f16 = Tex.Sample(S, uv);
	fout.i16 = TexI16.Load(int3(1, 2, 3));
	fout.u16 = TexU16.Load(int3(4, 5, 6));

	fout.f16 += Tex.GatherRed(S, uv);
	fout.i16 += TexI16.GatherGreen(S, uv);
	fout.u16 += TexU16.GatherBlue(S, uv);

	fout.f16 += Tex.SampleCmp(SComp, uv, 0.5).x;
	fout.f16 += Tex.SampleCmpLevelZero(SComp, uv, 0.5).x;
	fout.f16 += Tex.GatherCmp(SComp, uv, 0.5);

	fout.f16 += Tex.SampleLevel(S, uv, 0.0);
	fout.f16 += Tex.SampleGrad(S, uv, float2(0.2, 0.3), float2(0.4, 0.5));
	fout.f16 += Tex.SampleBias(S, uv, 0.5);

	fout.f16 += Buf[int(uv.x)];
	fout.i16 += BufI16[int(uv.x)];
	fout.u16 += BufU16[int(uv.x)];

	return fout;
}
