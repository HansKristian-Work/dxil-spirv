SamplerState S[3] : register(s5);
Texture2D T;
float4 main(uint v : V) : SV_Target
{
	return T.Sample(S[0], 0.5.xx) + T.Sample(S[2], 0.5.xx) + T.Sample(S[v], 0.5.xx);
}

