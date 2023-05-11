import smartpy as sp

FA2 = sp.io.import_script_from_url("file:./contracts/fa2_lib.py")


class SampleNFT(
    FA2.Admin,
    FA2.BurnNft,
    FA2.ChangeMetadata,
    FA2.MintNft,
    FA2.WithdrawMutez,
    FA2.Fa2Nft
):
    def __init__(self, admin, metadata, token_metadata = {}, ledger = {}, policy = None, metadata_base = None):
        FA2.Fa2Nft.__init__(self, metadata, token_metadata = token_metadata, ledger = ledger, policy = policy, metadata_base = metadata_base)
        FA2.Admin.__init__(self, admin)


@sp.add_test(name = "SampleNFT")
def test():
    scenario = sp.test_scenario()
    admin = sp.test_account("Admin")

    scenario.h1("SampleNFT")
    nft = SampleNFT(
        admin = admin.address,
        metadata = sp.utils.metadata_of_url("http://example.com")
    )
    scenario += nft


sp.add_compilation_target(
    "SampleNFT Deployment",
    SampleNFT(
        admin   = sp.address("tz1bb299QQuWXuYbynKzPfdVftmZdAQrvrGN"),
        metadata = sp.utils.metadata_of_url("https://example.com")
    )
)